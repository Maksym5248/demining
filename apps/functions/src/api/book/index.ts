import * as fs from 'fs';
import * as path from 'path';

import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
    ASSET_TYPE,
    type IBookAssetsDB,
    TABLES,
    type Timestamp,
    ROLES,
    type IBookDB,
    type IBookAssetsPageDB,
} from 'shared-my';

import { checkAuthorized, checkIdParam, checkRoles } from '~/utils';

import { parsePDF } from '../../parser/pdfParser';

const db = admin.firestore();
const storage = admin.storage(); // Uses the default bucket

async function ensureBookAssetsParsed(bookId: string) {
    logger.info(`Starting ensureBookAssetsParsed for bookId: ${bookId}`);

    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS).doc(bookId);
    const bookAssets = await bookAssetsRef.get();

    if (bookAssets.exists) {
        logger.info(`Assets for book ${bookId} already exist.`);
        return;
    }

    const bookRef = db.collection(TABLES.BOOK).doc(bookId);
    const book = await bookRef.get();
    const bookData = book.data() as IBookDB | undefined;

    if (!bookData?.uri) {
        logger.error(
            `Failed to download book from URI for bookId ${bookId}. Error: No downloadable URI found.`,
        );
        throw new Error(`No downloadable URI found for bookId: ${bookId}`);
    }

    const bookFilePath = `/tmp/${bookId}.pdf`;

    try {
        const response = await fetch(bookData.uri);
        const fileStream = fs.createWriteStream(bookFilePath);
        const reader = response.body?.getReader();

        if (!reader) {
            logger.error(`Failed to get reader from response body for bookId ${bookId}.`);
            throw new Error('Failed to get reader from response body');
        }

        let done = false;
        while (!done) {
            const { done: isDone, value } = await reader.read();
            done = isDone;
            if (value) fileStream.write(value);
        }

        fileStream.end();
        logger.info(`Successfully downloaded book to ${bookFilePath} for bookId ${bookId}.`);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
            `Failed to download book from URI for bookId ${bookId}. Error: ${errorMessage}`,
        );
        throw error;
    }

    const imagesDir = `/tmp/${bookId}_images`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    logger.info(`Parsing PDF for ${bookId}. Images dir: ${imagesDir}`);
    const parsed = await parsePDF(bookFilePath, imagesDir);
    logger.info(`Successfully parsed PDF for ${bookId}`);

    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    const pages: IBookAssetsPageDB[] = [];
    const imageUrls: string[] = [];

    logger.info(`Found ${imageFiles.length} images to upload for ${bookId}.`);

    for (const imgFile of imageFiles) {
        const localPath = path.join(imagesDir, imgFile);
        const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;

        logger.info(`Uploading image ${imgFile} to gs://${storage.bucket().name}/${storagePath}`);
        await storage.bucket().upload(localPath, { destination: storagePath });

        // Generate a signed URL for the uploaded file
        const [signedUrl] = await storage.bucket().file(storagePath).getSignedUrl({
            action: 'read',
            expires: '03-01-2500', // Set an expiration date far in the future
        });

        imageUrls.push(signedUrl);

        const pageNumberMatch = imgFile.match(/page-(\d+)/);
        const pageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1], 10) : 0;

        const pageIndex = pages.findIndex(page => page.page === pageNumber);
        if (pageIndex === -1) {
            pages.push({
                page: pageNumber,
                items: [{ type: 'image', value: signedUrl }],
            });
        } else {
            pages[pageIndex].items.push({ type: 'image', value: signedUrl });
        }
    }

    logger.info(`Successfully uploaded ${imageUrls.length} images for ${bookId}.`);

    const docData: IBookAssetsDB = {
        id: bookId,
        pages,
        metadata: parsed.metadata,
        viewport: parsed.viewport,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
    };
    logger.info(`Saving parsed data to Firestore for book ${bookId}.`);
    await bookAssetsRef.set(docData);
    logger.info(`Successfully saved data to Firestore for book ${bookId}.`);

    try {
        fs.rmSync(bookFilePath, { force: true });
        fs.rmSync(imagesDir, { recursive: true, force: true });
        logger.info(`Cleaned up temporary files for ${bookId}.`);
    } catch (cleanupError: unknown) {
        const cleanupErrorMessage =
            cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error';
        logger.warn(
            `Warning: Failed to clean up temporary files for ${bookId}: ${cleanupErrorMessage}`,
        );
    }

    return docData;
}

export const parseBook = onCall(
    {
        region: process.env.REGION ?? 'europe-central2',
        cpu: 1,
        memory: '1GiB',
        timeoutSeconds: 1200,
    },
    async request => {
        const bookId = request.data.bookId;

        checkIdParam(request, bookId);
        checkAuthorized(request);
        checkRoles(request, [ROLES.AMMO_CONTENT_ADMIN, ROLES.AMMO_AUTHOR]);

        logger.info(
            `User ${request.auth?.uid} authorized. Processing manual request for bookId: ${bookId}`,
        );

        try {
            const result = await ensureBookAssetsParsed(bookId);
            logger.info(`Successfully processed book ${bookId}. Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(
                `Error processing book ${bookId} triggered by manual call: ${errorMessage}`,
            );
            if (error instanceof HttpsError) {
                throw error;
            }
            throw new HttpsError(
                'internal',
                `An internal error occurred while processing book ${bookId}.`,
                { originalError: errorMessage },
            );
        }
    },
);
