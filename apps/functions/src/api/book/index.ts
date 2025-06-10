import * as fs from 'fs';
import * as path from 'path';

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
    ASSET_TYPE,
    type IBookAssetsDB,
    TABLES,
    type Timestamp,
    ROLES,
    type IBookDB,
} from 'shared-my';

import { checkAuthorized, checkIdParam, checkRoles } from '~/utils';

import { parsePDF } from '../../parser/pdfParser';

const db = admin.firestore();
const storage = admin.storage(); // Uses the default bucket

async function ensureBookAssetsParsed(bookId: string) {
    console.info(`Starting ensureBookAssetsParsed for bookId: ${bookId}`);

    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS).doc(bookId);
    const bookAssets = await bookAssetsRef.get();

    if (bookAssets.exists) {
        console.info(`Assets for book ${bookId} already exist.`);
        return;
    }

    const bookRef = db.collection(TABLES.BOOK).doc(bookId);
    const book = await bookRef.get();
    const bookData = book.data() as IBookDB | undefined;

    if (!bookData?.uri) {
        throw new Error(`No downloadable URI found for bookId: ${bookId}`);
    }

    const bookFilePath = `/tmp/${bookId}.pdf`;

    try {
        const response = await fetch(bookData.uri);
        const fileStream = fs.createWriteStream(bookFilePath);
        const reader = response.body?.getReader();

        if (!reader) {
            throw new Error('Failed to get reader from response body');
        }

        let done = false;
        while (!done) {
            const { done: isDone, value } = await reader.read();
            done = isDone;
            if (value) fileStream.write(value);
        }

        fileStream.end();
        console.info(`Successfully downloaded book to ${bookFilePath}`);
    } catch (error) {
        console.error(`Failed to download book from URI for bookId ${bookId}. Error:`, error);
        throw error;
    }

    const imagesDir = `/tmp/${bookId}_images`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    console.info(`Parsing PDF for ${bookId}. Images dir: ${imagesDir}`);
    const parsed = await parsePDF(bookFilePath, imagesDir);
    console.info(`Successfully parsed PDF for ${bookId}`);

    // 4. Save images to storage
    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\\.(png|jpg|jpeg)$/i.test(f));
    const imageUrls: string[] = [];
    console.info(`Found ${imageFiles.length} images to upload for ${bookId}.`);

    for (const imgFile of imageFiles) {
        const localPath = path.join(imagesDir, imgFile);
        const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;
        console.info(`Uploading image ${imgFile} to gs://${storage.bucket().name}/${storagePath}`);
        await storage.bucket().upload(localPath, { destination: storagePath }); // Using default bucket
        imageUrls.push(storagePath);
    }
    console.info(`Successfully uploaded ${imageUrls.length} images for ${bookId}.`);

    // 5. Save parsed JSON to Firestore
    const docData: IBookAssetsDB = {
        ...parsed,
        id: bookId,
        images: imageUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp, // Added updatedAt
    };
    console.info(`Saving parsed data to Firestore for book ${bookId}.`);
    await bookAssetsRef.set(docData);
    console.info(`Successfully saved data to Firestore for book ${bookId}.`);

    // Clean up temporary files
    try {
        fs.rmSync(bookFilePath, { force: true });
        fs.rmSync(imagesDir, { recursive: true, force: true });
        console.info(`Cleaned up temporary files for ${bookId}.`);
    } catch (cleanupError) {
        console.warn(`Warning: Failed to clean up temporary files for ${bookId}:`, cleanupError);
    }

    return docData;
}

export const parseBook = onCall(
    {
        region: process.env.REGION ?? 'europe-central2',
        cpu: 1,
        memory: '1GiB',
        timeoutSeconds: 540,
    },
    async request => {
        const bookId = request.data.bookId;

        checkIdParam(request, bookId);
        checkAuthorized(request);
        checkRoles(request, [ROLES.AMMO_CONTENT_ADMIN, ROLES.AMMO_AUTHOR]);

        console.info(
            `User ${request.auth?.uid} authorized. Processing manual request for bookId: ${bookId}`,
        );

        try {
            const result = await ensureBookAssetsParsed(bookId);
            console.info(`Successfully processed book ${bookId}. Result:`, result);
            return result; // Data returned here will be sent back to the client
        } catch (error: any) {
            console.error(`Error processing book ${bookId} triggered by manual call:`, error);
            if (error instanceof HttpsError) {
                throw error;
            }
            throw new HttpsError(
                'internal',
                `An internal error occurred while processing book ${bookId}.`,
                { originalError: error.message },
            );
        }
    },
);
