import { Translate } from '@google-cloud/translate/build/src/v2';
import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { set, cloneDeep } from 'lodash'; // Using lodash for safe nested access and cloning

import {
    collectionsToTranslate,
    findTranslatableTexts,
    SOURCE_LANG,
    TARGET_LANG,
    translatableFieldsConfig,
} from '../../../utils';

const app = initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    credential: credential.cert(require('../../../../firebase-adminsdk.json')),
});

const translateExistingData = async () => {
    const firestore = admin.firestore();

    const translate = new Translate({ projectId: app.options.projectId });

    console.info('Starting translation backfill process...');
    let documentsProcessed = 0;
    let documentsTranslated = 0;
    let documentsSkipped = 0;
    const errors: string[] = [];

    try {
        for (const collectionId of collectionsToTranslate) {
            console.info(`Processing collection: ${collectionId}`);
            const sourceCollectionPath = `${collectionId}/LANG/${SOURCE_LANG}`;
            const sourceCollectionRef = firestore.collection(sourceCollectionPath);

            const snapshot = await sourceCollectionRef.get();
            if (snapshot.empty) {
                console.log(`No documents found in ${sourceCollectionPath}`);
                continue;
            }

            console.log(`Found ${snapshot.size} documents in ${sourceCollectionPath}`);

            for (const sourceDoc of snapshot.docs) {
                documentsProcessed++;
                const docId = sourceDoc.id;
                const sourceData = sourceDoc.data();
                const targetPath = `${collectionId}/LANG/${TARGET_LANG}/${docId}`;
                const targetDocRef = firestore.doc(targetPath);

                try {
                    // Check if target document already exists
                    const targetDoc = await targetDocRef.get();
                    if (targetDoc.exists) {
                        // logger.log(`Target document already exists, skipping: ${targetPath}`); // Optional: reduce log noise
                        documentsSkipped++;
                        continue;
                    }

                    // Find texts to translate
                    const configPaths = translatableFieldsConfig[collectionId] || [];
                    if (configPaths.length === 0) {
                        // logger.log(`No config for ${collectionId}, copying document: ${targetPath}`); // Optional
                        await targetDocRef.set(sourceData); // Copy as-is if no config
                        documentsTranslated++; // Count as "processed" for translation
                        continue;
                    }

                    const { textsToTranslate, pathsToUpdate } = findTranslatableTexts(
                        sourceData,
                        configPaths,
                    );

                    if (textsToTranslate.length === 0) {
                        // logger.log(`No translatable text found, copying document: ${targetPath}`); // Optional
                        await targetDocRef.set(sourceData); // Copy as-is if no text found
                        documentsTranslated++; // Count as "processed" for translation
                        continue;
                    }

                    // Perform Translation
                    const [translations] = await translate.translate(textsToTranslate, {
                        from: SOURCE_LANG,
                        to: TARGET_LANG,
                    });

                    if (translations.length !== textsToTranslate.length) {
                        throw new Error(
                            `Translation count mismatch: expected ${textsToTranslate.length}, got ${translations.length}`,
                        );
                    }

                    // Reconstruct the translated data object
                    const translatedData = cloneDeep(sourceData);
                    pathsToUpdate.forEach((pathInfo, index) => {
                        set(translatedData, pathInfo.path, translations[index]);
                    });

                    // Write the translated data
                    await targetDocRef.set(translatedData);
                    documentsTranslated++;
                    console.log(`Successfully translated and wrote document: ${targetPath}`);
                    console.log(`Processed document: ${documentsProcessed}`); // Optional
                    console.log(`Translated document: ${documentsTranslated}`); // Optional
                    console.log(`Skipped document: ${documentsSkipped}`); // Optional
                } catch (docError: any) {
                    console.error(
                        `Error processing document ${sourceCollectionPath}/${docId}:`,
                        docError,
                    );
                    errors.push(`Doc ${sourceCollectionPath}/${docId}: ${docError.message}`);
                }
            } // End loop through docs
        } // End loop through collections

        console.info('Translation backfill process completed.');
    } catch (error: any) {
        console.error('Fatal error during translation backfill:', error);
    }
};

translateExistingData().catch(err => console.error(err));
