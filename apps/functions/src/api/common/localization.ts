import { Translate } from '@google-cloud/translate/build/src/v2';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';
import { set, cloneDeep } from 'lodash'; // Using lodash for safe nested access and cloning

import {
    collectionsToTranslate,
    findTranslatableTexts,
    translatableFieldsConfig,
    DEFAULT_SOURCE_LANG,
    TARGET_LANGS,
} from '../../utils';

const firestore = admin.firestore();
const app = admin.app();
const projectId = app.options.projectId;

// Initialize Google Cloud Translation API client
const translate = new Translate({ projectId });

// --- Cloud Function ---
export const translateOnWrite = functions
    .region(process.env.REGION ?? 'europe-central2')
    .firestore.document('{collectionId}/LANG/{langId}/{docId}')
    .onWrite(async (change, context) => {
        const { collectionId, docId, langId } = context.params;
        let sourceLang = DEFAULT_SOURCE_LANG;
        let targetLangs = TARGET_LANGS.filter(lang => lang !== sourceLang);

        if (!collectionsToTranslate.includes(collectionId)) {
            logger.log(`Skipping collection: ${collectionId}`);
            return null;
        }

        const sourceData = change.after.data();
        if (!sourceData) {
            logger.error('Source data is missing for document:', change.after.ref.path);
            return null;
        }

        if (sourceData?.originalLang) {
            sourceLang = sourceData.originalLang;
            targetLangs = TARGET_LANGS.filter(lang => lang !== sourceLang);
        }

        if (langId !== sourceLang) {
            logger.error('Source data is missing for document:', change.after.ref.path);
            return null;
        }

        targetLangs.forEach(async targetLang => {
            const targetPath = `${collectionId}/LANG/${targetLang}/${docId}`;
            const targetDocRef = firestore.doc(targetPath);

            // 2. Handle Deletion
            if (!change.after.exists) {
                logger.log(`Source document deleted, deleting target: ${targetPath}`);
                try {
                    await targetDocRef.delete();
                    logger.log(`Successfully deleted target document: ${targetPath}`);
                } catch (error) {
                    logger.error(`Error deleting target document ${targetPath}:`, error);
                }
                return null;
            }

            const configPaths = translatableFieldsConfig[collectionId] || [];
            if (configPaths.length === 0) {
                logger.log(
                    `No translatable fields configured for collection: ${collectionId}. Copying data as is.`,
                );
                try {
                    // Copy all data if no specific fields are configured
                    await targetDocRef.set(sourceData, { merge: true });
                    logger.log(`Copied data to target document: ${targetPath}`);
                } catch (error) {
                    logger.error(`Error copying data to target document ${targetPath}:`, error);
                }
                return null;
            }

            // 4. Find texts to translate
            const { textsToTranslate, pathsToUpdate } = findTranslatableTexts(
                sourceData,
                configPaths,
            );

            if (textsToTranslate.length === 0) {
                logger.log(
                    `No text found in translatable fields for document: ${change.after.ref.path}. Writing other fields.`,
                );
                try {
                    // Still write the document to sync non-translatable fields
                    await targetDocRef.set(sourceData, { merge: true });
                    logger.log(`Wrote non-translatable data to target document: ${targetPath}`);
                } catch (error) {
                    logger.error(
                        `Error writing non-translatable data to target document ${targetPath}:`,
                        error,
                    );
                }
                return null;
            }

            logger.log(
                `Found ${textsToTranslate.length} text segment(s) to translate for: ${targetPath}`,
            );

            // 5. Perform Translation
            try {
                const [translations] = await translate.translate(textsToTranslate, {
                    from: sourceLang,
                    to: targetLang,
                });

                if (translations.length !== textsToTranslate.length) {
                    logger.error(
                        `Translation count mismatch: expected ${textsToTranslate.length}, got ${translations.length}`,
                        { targetPath },
                    );
                    // Handle mismatch - maybe skip writing? Or write partial? For now, log and continue.
                }

                // 6. Reconstruct the translated data object
                const translatedData = cloneDeep(sourceData); // Start with a deep copy

                pathsToUpdate.forEach((pathInfo, index) => {
                    if (index < translations.length) {
                        // Use lodash 'set' for safe nested path updates
                        set(translatedData, pathInfo.path, translations[index]);
                    } else {
                        logger.warn(`Missing translation for path: ${pathInfo.path.join('.')}`, {
                            targetPath,
                        });
                    }
                });

                // 7. Write the translated data to the target document
                await targetDocRef.set(translatedData, { merge: true }); // Use merge for updates
                logger.log(`Successfully translated and wrote document: ${targetPath}`);
            } catch (error) {
                logger.error(`Error translating or writing document ${targetPath}:`, error);
                // Consider adding more specific error handling or retry logic
            }
        });

        return null;
    });
