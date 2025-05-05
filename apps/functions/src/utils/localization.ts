export const DEFAULT_SOURCE_LANG = 'uk';
export const TARGET_LANGS = ['uk', 'en'];

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
    'COMMENT',
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
        'filler.[].name', // Translate 'value' in each item of 'additional' array
        'filler.[].description', // Translate 'value' in each item of 'additional' array
        'liquidatorShort',
        'foldingShort',
        'extractionShort',
        'timeWork',
        'targetSensor',
        'damageV2.action',
        'damageV2.additional.[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'damageV2.additional.[].value', // Translate 'value' in each item of 'damageV2.additional' array
        'sizeV2.[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'sensitivityV2.sensitivity',
        'sensitivityV2.additional.[].name', // Translate 'value' in each item of 'sensitivityV2.additional' array
        'sensitivityV2.additional.[].value', // Translate 'value' in each item of 'sensitivityV2.additional' array
        'additional.[].name',
        'additional.[].value', // Translate 'value' in each item of 'additional' array
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
        'additional.[].name',
        'additional.[].value',
        'composition.[].name',
        'composition.[].description',
        'sensitivity.shock',
        'sensitivity.temperature',
        'sensitivity.friction',
    ],
    EXPLOSIVE_v2: [
        'name',
        'fullName',
        'description',
        'sizeV2.[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'filler.[].name', // Translate 'value' in each item of 'damageV2.additional' array
        'filler.[].description', // Translate 'value' in each item of 'damageV2.additional' array
        'purpose.description',
        'structure.description',
        'action.description',
        'additional.[].name',
        'additional.[].value',
        'marking.description',
        'usage.description',
    ],
    BOOK_TYPE: ['name'],
    COUNTRY: ['name'],
    EXPLOSIVE_DEVICE_TYPE: ['name'],
    EXPLOSIVE_OBJECT_COMPONENT: ['name'],
    MATERIAL: ['name'],
    MISSION_REQUEST_TYPE: ['name'],
    RANKS: ['fullName', 'shortName'],
    STATUSES: ['name'],
    COMMENT: ['text'],
};

interface PathInfo {
    path: (string | number)[]; // Array representing the path (e.g., ['damageV2', 'additional', 0, 'value'])
    originalValue: string;
}

/**
 * Recursively finds all strings to translate based on the configuration.
 * @param data The object/array to traverse.
 * @param configPaths The configured dot-notation paths (e.g., "prop.subprop", "array[].field").
 * @param currentPath Internal: The current path being traversed from the root.
 * @param textsToTranslate Output: Array to collect texts.
 * @param pathsToUpdate Output: Array to collect path info for reconstruction.
 */

export function findTranslatableTexts(
    data: any,
    configPaths: string[], // Config paths relevant to the *root* object structure
    currentPath: (string | number)[] = [], // Path from root to current 'data'
    textsToTranslate: string[] = [],
    pathsToUpdate: PathInfo[] = [],
): { textsToTranslate: string[]; pathsToUpdate: PathInfo[] } {
    // Base case: If data is not an object or array, or is null, stop recursion.
    if (!data || typeof data !== 'object') {
        return { textsToTranslate, pathsToUpdate };
    }

    // Iterate through keys of the current data object/array
    for (const key in data) {
        // Ensure it's an own property
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;

        const value = data[key];
        // Construct the path to the current value
        const newPath = [...currentPath, Array.isArray(data) ? parseInt(key, 10) : key];
        const newPathStr = newPath.join('.'); // Full path string from root, e.g., "items.0.name"

        // --- Path Matching Logic ---
        let isMatch = false;

        // Check 1: Direct match
        if (configPaths.includes(newPathStr)) {
            isMatch = true;
        } else {
            // Check 2: Array pattern match
            try {
                // Generate pattern like items.[].name from items.0.name
                const patternPath = newPathStr.replace(/\.(\d+)(?=\.|$)/g, '.[]');
                // Check if conversion happened AND if the pattern exists in config
                if (patternPath !== newPathStr && configPaths.includes(patternPath)) {
                    isMatch = true;
                }
            } catch (e) {
                // Log regex error if it occurs (shouldn't happen often)
                console.error(`Regex error processing path: ${newPathStr}`, e); // Keep this error log
            }
        }
        // --- End Path Matching ---

        // If the current path is configured for translation and the value is a string
        if (isMatch && typeof value === 'string' && value.trim() !== '') {
            // Avoid adding duplicates based on the exact path string
            if (!pathsToUpdate.some(p => p.path.join('.') === newPathStr)) {
                textsToTranslate.push(value);
                pathsToUpdate.push({ path: newPath, originalValue: value });
            }
            // Removed duplicate skipped log
        }

        // --- Recursion Logic ---
        if (value && typeof value === 'object') {
            // Calculate the pattern prefix for the current path + '.'
            const patternPrefix = newPathStr.replace(/\.(\d+)(?=\.|$)/g, '.[]') + '.';

            // Check if any config path starts with this pattern prefix
            const hasDeeperConfigs = configPaths.some(p => p.startsWith(patternPrefix));

            // Removed recursion check log

            if (hasDeeperConfigs) {
                findTranslatableTexts(value, configPaths, newPath, textsToTranslate, pathsToUpdate);
            }
        }
        // --- End Recursion ---
    } // End of for loop

    return { textsToTranslate, pathsToUpdate };
}
