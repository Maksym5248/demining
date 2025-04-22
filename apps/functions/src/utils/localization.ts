import { get } from 'lodash'; // Using lodash for safe nested access and cloning

export const SOURCE_LANG = 'uk';
export const TARGET_LANG = 'en';

// List of collections to apply translation to
export const collectionsToTranslate = [
    'EXPLOSIVE_OBJECT_TYPE_v2',
    'EXPLOSIVE_OBJECT_CLASS_v2',
    'EXPLOSIVE_OBJECT_CLASS_ITEM_v2',
    'EXPLOSIVE_OBJECT_v2',
    'EXPLOSIVE_OBJECT_DETAILS_v2',
    'EXPLOSIVE_NEW_v2',
    'EXPLOSIVE_v2',
    'BOOK_TYPE',
    'COUNTRY',
    'EXPLOSIVE_DEVICE_TYPE',
    'EXPLOSIVE_OBJECT_COMPONENT',
    'MATERIAL',
    'MISSION_REQUEST_TYPE',
    'RANKS',
    'STATUSES',
];

// Define translatable fields using dot notation for nested paths.
// Use '[]' to indicate iteration over array elements for a specific field.
export const translatableFieldsConfig: { [collection: string]: string[] } = {
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
    BOOK_TYPE: ['name'],
    COUNTRY: ['name'],
    EXPLOSIVE_DEVICE_TYPE: ['name'],
    EXPLOSIVE_OBJECT_COMPONENT: ['name'],
    MATERIAL: ['name'],
    MISSION_REQUEST_TYPE: ['name'],
    RANKS: ['fullName', 'shortName'],
    STATUSES: ['name'],
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
export function findTranslatableTexts(
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
