import * as fs from 'fs';
import * as path from 'path';

import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { ASSET_TYPE, type IBookAssetsDB, TABLES, type Timestamp, ROLES } from 'shared-my';

import { checkAuthorized, checkIdParam, checkRoles } from '~/utils';

import { parsePDF } from '../../parser/pdfParser';

const db = admin.firestore();
const storage = admin.storage(); // Uses the default bucket

async function ensureBookAssetsParsed(bookId: string) {
    logger.info(`Starting ensureBookAssetsParsed for bookId: ${bookId}`);
    logger.info(`Bucked name: ${process.env.STORAGE_BUCKET}`);

    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS).doc(bookId);
    const bookAssetsSnap = await bookAssetsRef.get();
    if (bookAssetsSnap.exists) {
        logger.info(`Assets for book ${bookId} already exist.`, bookAssetsSnap.data());
        return bookAssetsSnap.data();
    }

    const bookFilePath = `/tmp/${bookId}.pdf`;

    const bookStoragePath = `${ASSET_TYPE.BOOK}/${bookId}.pdf`; // Ensure this matches your storage structure
    logger.info(
        `Downloading book from ${process.env.STORAGE_BUCKET}/${bookStoragePath} to ${bookFilePath}`,
    );

    const file = storage.bucket(process.env.STORAGE_BUCKET).file(bookStoragePath); // Using default bucket

    try {
        await file.download({ destination: bookFilePath });
        logger.info(`Successfully downloaded ${bookStoragePath}`);
    } catch (error) {
        logger.error(
            `Failed to download book ${bookStoragePath} for bookId ${bookId}. Error:`,
            error,
        );
        throw error; // Re-throw to handle in the calling function or let Firebase handle
    }

    const imagesDir = `/tmp/${bookId}_images`;
    const fontsDir = `/tmp/${bookId}_fonts`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

    logger.info(`Parsing PDF for ${bookId}. Images dir: ${imagesDir}, Fonts dir: ${fontsDir}`);
    const parsed = await parsePDF(bookFilePath, imagesDir, fontsDir);
    logger.info(`Successfully parsed PDF for ${bookId}`);

    // 4. Save images to storage
    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\\.(png|jpg|jpeg)$/i.test(f));
    const imageUrls: string[] = [];
    logger.info(`Found ${imageFiles.length} images to upload for ${bookId}.`);

    for (const imgFile of imageFiles) {
        const localPath = path.join(imagesDir, imgFile);
        const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;
        logger.info(`Uploading image ${imgFile} to gs://${storage.bucket().name}/${storagePath}`);
        await storage.bucket().upload(localPath, { destination: storagePath }); // Using default bucket
        imageUrls.push(storagePath);
    }
    logger.info(`Successfully uploaded ${imageUrls.length} images for ${bookId}.`);

    // 5. Save parsed JSON to Firestore
    const docData: IBookAssetsDB = {
        ...parsed,
        id: bookId,
        images: imageUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp, // Added updatedAt
    };
    logger.info(`Saving parsed data to Firestore for book ${bookId}.`);
    await bookAssetsRef.set(docData);
    logger.info(`Successfully saved data to Firestore for book ${bookId}.`);

    // Clean up temporary files
    try {
        fs.rmSync(bookFilePath, { force: true });
        fs.rmSync(imagesDir, { recursive: true, force: true });
        fs.rmSync(fontsDir, { recursive: true, force: true });
        logger.info(`Cleaned up temporary files for ${bookId}.`);
    } catch (cleanupError) {
        logger.warn(`Warning: Failed to clean up temporary files for ${bookId}:`, cleanupError);
    }

    return docData;
}

export const parseBook = onCall(
    {
        cpu: 1,
        memory: '1GiB',
        timeoutSeconds: 540,
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
            logger.info(`Successfully processed book ${bookId}. Result:`, result);
            return result; // Data returned here will be sent back to the client
        } catch (error: any) {
            logger.error(`Error processing book ${bookId} triggered by manual call:`, error);
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
