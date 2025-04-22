import { Translate } from '@google-cloud/translate/build/src/v2';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';
import { get, set, cloneDeep } from 'lodash'; // Using lodash for safe nested access and cloning

const firestore = admin.firestore();
const app = admin.app();
const projectId = app.options.projectId;

// Initialize Google Cloud Translation API client
const translate = new Translate({ projectId });

// --- Configuration ---

const SOURCE_LANG = 'uk';
const TARGET_LANG = 'en';

// List of collections to apply translation to
const collectionsToTranslate = [
    'EXPLOSIVE_OBJECT_TYPE_v2',
    'EXPLOSIVE_OBJECT_CLASS_v2',
    'EXPLOSIVE_OBJECT_CLASS_ITEM_v2',
    'EXPLOSIVE_OBJECT_v2',
    'EXPLOSIVE_OBJECT_DETAILS_v2',
    'EXPLOSIVE_NEW_v2',
    'EXPLOSIVE_v2',
];

// Define translatable fields using dot notation for nested paths.
// Use '[]' to indicate iteration over array elements for a specific field.
const translatableFieldsConfig: { [collection: string]: string[] } = {
    EXPLOSIVE_OBJECT_TYPE_v2: ['name', 'fullName'],
    EXPLOSIVE_OBJECT_CLASS_v2: ['name'],
    EXPLOSIVE_OBJECT_CLASS_ITEM_v2: ['name', 'shortName', 'description'],
    EXPLOSIVE_OBJECT_v2: ['name', 'fullName', 'description'],
    EXPLOSIVE_OBJECT_DETAILS_v2: [
        'fullDescription',
        'filler[].name', // Translate 'value' in each item of 'additional' array
        'filler[].description', // Translate 'value' in each item of 'additional' array
        'liquidatorShort',
        'foldingShort',
        'extractionShort',
        'timeWork',
        'damageV2.action',
        'damageV2.additional[].value', // Translate 'value' in each item of 'damageV2.additional' array
        'sizeV2[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'sensitivityV2.sensitivity',
        'sensitivityV2.additional[].value', // Translate 'value' in each item of 'sensitivityV2.additional' array
        'additional[].value', // Translate 'value' in each item of 'additional' array
        'purpose.description',
        'structure.description',
        'action.description',
        'installation.description',
        'liquidator.description',
        'extraction.description',
        'folding.description',
        'neutralization.description',
        'marking.description',
        'historical.description',
    ],
    EXPLOSIVE_NEW_v2: [
        'name',
        'fullName',
        'description',
        'additional[].value',
        'composition[].name',
        'composition[].description',
        'sensitivity.shock',
        'sensitivity.temperature',
        'sensitivity.friction',
    ],
    EXPLOSIVE_v2: [
        'name',
        'fullName',
        'description',
        'sizeV2[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'filler[].description', // Translate 'value' in each item of 'damageV2.additional' array
        'purpose.description',
        'structure.description',
        'action.description',
        'additional[].value',
        'marking.description',
        'usage.description',
        'marking.description',
    ],
};

interface PathInfo {
    path: (string | number)[]; // Array representing the path (e.g., ['damageV2', 'additional', 0, 'value'])
    originalValue: string;
}

/**
 * Recursively finds all strings to translate based on the configuration.
 * @param data The object/array to traverse.
 * @param configPaths The configured dot-notation paths for this data structure.
 * @param currentPath Internal: The current path being traversed.
 * @param textsToTranslate Output: Array to collect texts.
 * @param pathsToUpdate Output: Array to collect path info for reconstruction.
 */
function findTranslatableTexts(
    data: any,
    configPaths: string[],
    currentPath: (string | number)[] = [],
    textsToTranslate: string[] = [],
    pathsToUpdate: PathInfo[] = [],
): { textsToTranslate: string[]; pathsToUpdate: PathInfo[] } {
    if (!data) {
        return { textsToTranslate, pathsToUpdate };
    }

    // Check direct paths first (for non-array fields at the current level)
    for (const configPath of configPaths) {
        const pathSegments = configPath.split('.');
        const currentPathStr = currentPath.join('.');

        // Handle direct string match at the current level
        if (
            pathSegments.length === currentPath.length + 1 &&
            configPath.startsWith(currentPathStr) &&
            !configPath.includes('[]') // Ensure it's not an array config path
        ) {
            const field = pathSegments[pathSegments.length - 1];
            // Use lodash get relative to the current data object
            const value = get(data, field);
            if (typeof value === 'string' && value.trim() !== '') {
                const fullPath = [...currentPath, field];
                // Avoid duplicates if paths overlap in config (simple check)
                if (!pathsToUpdate.some(p => p.path.join('.') === fullPath.join('.'))) {
                    textsToTranslate.push(value);
                    pathsToUpdate.push({ path: fullPath, originalValue: value });
                }
            }
        }
    }

    // Traverse deeper (objects and arrays)
    if (typeof data === 'object') {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                const newPath = [...currentPath, key];
                const newPathStr = newPath.join('.');

                // Check if any config path starts with this new path OR matches an array pattern
                const relevantConfigPaths = configPaths.filter(
                    p =>
                        p.startsWith(newPathStr + '.') || // Matches nested objects/fields
                        p === newPathStr || // Matches the exact path (for direct objects)
                        p.startsWith(newPathStr.replace(/\.\d+/g, '.[]') + '.'), // Matches array item fields
                );

                if (relevantConfigPaths.length > 0) {
                    if (Array.isArray(value)) {
                        // --- CORRECTED ARRAY HANDLING ---
                        const arrayPatternBase = newPathStr + '[]'; // e.g., "sizeV2[]"
                        value.forEach((item, index) => {
                            const itemPath = [...newPath, index]; // Path to the current item, e.g., ['sizeV2', 0]
                            // Find config paths relevant to this item's fields (e.g., "sizeV2[].name")
                            const itemConfigPaths = configPaths
                                .filter(p => p.startsWith(arrayPatternBase + '.'))
                                .map(p => p.substring(arrayPatternBase.length + 1)); // Extract sub-field, e.g., "name"

                            if (itemConfigPaths.length > 0) {
                                // If the item itself is an object, recurse with the sub-paths
                                if (item && typeof item === 'object') {
                                    findTranslatableTexts(
                                        item,
                                        itemConfigPaths, // Pass only the relevant sub-paths (e.g., ['name'])
                                        itemPath, // Pass the correct path to the item
                                        textsToTranslate,
                                        pathsToUpdate,
                                    );
                                }
                                // If item is a simple string and config is just 'array[]' (not currently supported by config)
                                // else if (typeof item === 'string' && configPaths.includes(arrayPatternBase)) { ... }
                            }
                        });
                        // --- END CORRECTION ---
                    } else if (typeof value === 'object' && value !== null) {
                        // Recurse for nested objects
                        findTranslatableTexts(
                            value,
                            configPaths, // Pass the original configPaths down
                            newPath,
                            textsToTranslate,
                            pathsToUpdate,
                        );
                    }
                    // Direct string check is now handled correctly within the recursion or the initial loop
                }
            }
        }
    }

    return { textsToTranslate, pathsToUpdate };
}

// --- Cloud Function ---

export const translateOnWrite = functions.firestore
    .document('{collectionId}/LANG/' + SOURCE_LANG + '/{docId}')
    .onWrite(async (change, context) => {
        const { collectionId, docId } = context.params;

        // 1. Check if collection needs translation
        if (!collectionsToTranslate.includes(collectionId)) {
            logger.log(`Skipping collection: ${collectionId}`);
            return null;
        }

        const targetPath = `${collectionId}/LANG/${TARGET_LANG}/${docId}`;
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

        // 3. Handle Creation or Update
        const sourceData = change.after.data();
        if (!sourceData) {
            logger.error('Source data is missing for document:', change.after.ref.path);
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
        const { textsToTranslate, pathsToUpdate } = findTranslatableTexts(sourceData, configPaths);

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
                from: SOURCE_LANG,
                to: TARGET_LANG,
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

        return null;
    });
