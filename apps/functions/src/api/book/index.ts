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
    LOADING_STATUS,
} from 'shared-my';

import { checkAuthorized, checkIdParam, checkRoles } from '~/utils';

import { parsePDF } from '../../parser/pdfParser';

const db = admin.firestore();
const storage = admin.storage();

const uploadImages = async (
    imageFiles: string[],
    imagesDir: string,
    bookId: string,
): Promise<{ signedUrl: string; pageNumber: number; localPath: string }[]> => {
    return Promise.all(
        imageFiles.map(async imgFile => {
            const localPath = path.join(imagesDir, imgFile);
            const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;

            logger.info(
                `Uploading image ${imgFile} to gs://${storage.bucket().name}/${storagePath}`,
            );
            await storage.bucket().upload(localPath, { destination: storagePath });

            const [signedUrl] = await storage.bucket().file(storagePath).getSignedUrl({
                action: 'read',
                expires: '03-01-2500',
            });

            const pageNumberMatch = imgFile.match(/page-(\d+)/);
            const pageNumber = pageNumberMatch ? parseInt(pageNumberMatch[1], 10) : 0;

            logger.info(`Signed URL for image ${imgFile}: ${signedUrl}`);

            return { signedUrl, pageNumber, localPath };
        }),
    );
};

async function ensureBookAssetsParsed(bookId: string) {
    logger.info(`Starting ensureBookAssetsParsed for bookId: ${bookId}`);

    const bookRef = db.collection(TABLES.BOOK).doc(bookId);
    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS);

    const book = await bookRef.get();
    const bookData = book.data() as IBookDB | undefined;

    if (!book.exists) {
        logger.info(`Book ${bookId} is not exist`);
        return;
    }

    if (bookData?.assetsStatus === LOADING_STATUS.SUCCESS) {
        logger.error(`Book already parsed, bookId ${bookId}`);
        return;
    }

    if (bookData?.assetsStatus === LOADING_STATUS.LOADING) {
        logger.error(`Book is parsing, bookId ${bookId}`);
        return;
    }

    if (!bookData?.uri) {
        logger.error(
            `Failed to download book from URI for bookId ${bookId}. Error: No downloadable URI found.`,
        );
        throw new Error(`No downloadable URI found for bookId: ${bookId}`);
    }

    await bookRef.update({
        assetsStatus: LOADING_STATUS.LOADING,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
    });

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

    logger.info(`Found ${imageFiles.length} images to upload for ${bookId}.`);

    const imageUrls = await uploadImages(imageFiles, imagesDir, bookId);

    imageUrls.forEach(({ signedUrl, pageNumber }) => {
        let page = pages.find(page => page.page === pageNumber);
        if (!page) {
            page = { page: pageNumber, items: [] };
            pages.push(page);
        }

        page.items.push({ type: 'image', value: signedUrl });
    });

    logger.info(`Successfully uploaded ${imageUrls.length} images for ${bookId}.`);

    parsed.pages.forEach(pageData => {
        let page = pages.find(p => p.page === pageData.page);
        if (!page) {
            page = { page: pageData.page, items: [] };
            pages.push(page);
        }

        pageData.items.forEach(item => {
            if (item.type === 'image') {
                const signedUrl = imageUrls.find(url => url.localPath === item.value)?.signedUrl;
                if (signedUrl) {
                    page!.items.push({ type: 'image', value: signedUrl });
                }
            } else {
                page!.items.push(item);
            }
        });
    });

    logger.info(`Saving parsed data to Firestore for book ${bookId}.`);

    await Promise.all(
        pages.map(async page => {
            const id = admin.firestore().collection(TABLES.BOOK_ASSETS).doc().id;

            const docData: IBookAssetsDB = {
                id,
                bookId,
                page: page.page,
                texts: page.items.filter(item => item.type === 'image').map(item => item.value),
                images: page.items.filter(item => item.type === 'text').map(item => item.value),
                metadata: parsed.metadata,
                viewport: parsed.viewport,
                createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
                updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
            };
            await bookAssetsRef.doc(docData.id).set(docData);
        }),
    );

    await bookRef.update({
        assetsStatus: LOADING_STATUS.SUCCESS,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
    });

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
        await bookRef.update({
            assetsStatus: LOADING_STATUS.ERROR,
            updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        });
    }
}

export const parseBook = onCall(
    {
        region: process.env.REGION ?? 'europe-central2',
        cpu: 1,
        memory: '2GiB',
        timeoutSeconds: 2000,
        maxInstances: 1,
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
            await ensureBookAssetsParsed(bookId);
            logger.info(`Successfully processed book ${bookId}`);
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
