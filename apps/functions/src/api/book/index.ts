import * as fs from 'fs';
import * as path from 'path';

import { Logging } from '@google-cloud/logging';
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

const logging = new Logging();
const log = logging.log('functions-log');

const db = admin.firestore();
const storage = admin.storage(); // Uses the default bucket

async function ensureBookAssetsParsed(bookId: string) {
    log.write(
        log.entry({ severity: 'INFO' }, `Starting ensureBookAssetsParsed for bookId: ${bookId}`),
    );

    const bookAssetsRef = db.collection(TABLES.BOOK_ASSETS).doc(bookId);
    const bookAssets = await bookAssetsRef.get();

    if (bookAssets.exists) {
        log.write(log.entry({ severity: 'INFO' }, `Assets for book ${bookId} already exist.`));
        return;
    }

    const bookRef = db.collection(TABLES.BOOK).doc(bookId);
    const book = await bookRef.get();
    const bookData = book.data() as IBookDB | undefined;

    if (!bookData?.uri) {
        log.write(
            log.entry({ severity: 'ERROR' }, `No downloadable URI found for bookId: ${bookId}`),
        );
        throw new Error(`No downloadable URI found for bookId: ${bookId}`);
    }

    const bookFilePath = `/tmp/${bookId}.pdf`;

    try {
        const response = await fetch(bookData.uri);
        const fileStream = fs.createWriteStream(bookFilePath);
        const reader = response.body?.getReader();

        if (!reader) {
            log.write(log.entry({ severity: 'ERROR' }, 'Failed to get reader from response body'));
            throw new Error('Failed to get reader from response body');
        }

        let done = false;
        while (!done) {
            const { done: isDone, value } = await reader.read();
            done = isDone;
            if (value) fileStream.write(value);
        }

        fileStream.end();
        log.write(
            log.entry({ severity: 'INFO' }, `Successfully downloaded book to ${bookFilePath}`),
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.write(
            log.entry(
                { severity: 'ERROR' },
                `Failed to download book from URI for bookId ${bookId}. Error: ${errorMessage}`,
            ),
        );
        throw error;
    }

    const imagesDir = `/tmp/${bookId}_images`;
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    log.write(
        log.entry({ severity: 'INFO' }, `Parsing PDF for ${bookId}. Images dir: ${imagesDir}`),
    );
    const parsed = await parsePDF(bookFilePath, imagesDir);
    log.write(log.entry({ severity: 'INFO' }, `Successfully parsed PDF for ${bookId}`));

    const imageFiles = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
    const imageUrls: string[] = [];
    log.write(
        log.entry(
            { severity: 'INFO' },
            `Found ${imageFiles.length} images to upload for ${bookId}.`,
        ),
    );

    for (const imgFile of imageFiles) {
        const localPath = path.join(imagesDir, imgFile);
        const storagePath = `${ASSET_TYPE.BOOK_ASSETS}/${bookId}/${imgFile}`;
        log.write(
            log.entry(
                { severity: 'INFO' },
                `Uploading image ${imgFile} to gs://${storage.bucket().name}/${storagePath}`,
            ),
        );
        await storage.bucket().upload(localPath, { destination: storagePath });
        imageUrls.push(storagePath);
    }
    log.write(
        log.entry(
            { severity: 'INFO' },
            `Successfully uploaded ${imageUrls.length} images for ${bookId}.`,
        ),
    );

    const docData: IBookAssetsDB = {
        ...parsed,
        id: bookId,
        images: imageUrls,
        createdAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as Timestamp,
    };
    log.write(
        log.entry({ severity: 'INFO' }, `Saving parsed data to Firestore for book ${bookId}.`),
    );
    await bookAssetsRef.set(docData);
    log.write(
        log.entry({ severity: 'INFO' }, `Successfully saved data to Firestore for book ${bookId}.`),
    );

    try {
        fs.rmSync(bookFilePath, { force: true });
        fs.rmSync(imagesDir, { recursive: true, force: true });
        log.write(log.entry({ severity: 'INFO' }, `Cleaned up temporary files for ${bookId}.`));
    } catch (cleanupError: unknown) {
        const cleanupErrorMessage =
            cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error';
        log.write(
            log.entry(
                { severity: 'WARNING' },
                `Warning: Failed to clean up temporary files for ${bookId}: ${cleanupErrorMessage}`,
            ),
        );
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

        log.write(
            log.entry(
                { severity: 'INFO' },
                `User ${request.auth?.uid} authorized. Processing manual request for bookId: ${bookId}`,
            ),
        );

        try {
            const result = await ensureBookAssetsParsed(bookId);
            log.write(
                log.entry(
                    { severity: 'INFO' },
                    `Successfully processed book ${bookId}. Result: ${JSON.stringify(result)}`,
                ),
            );
            return result;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            log.write(
                log.entry(
                    { severity: 'ERROR' },
                    `Error processing book ${bookId} triggered by manual call: ${errorMessage}`,
                ),
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
