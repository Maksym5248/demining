import { findTranslatableTexts } from '../localization'; // Adjust path if needed

describe('findTranslatableTexts', () => {
    it('should return empty arrays for empty data or config', () => {
        expect(findTranslatableTexts({}, ['name'])).toEqual({
            textsToTranslate: [],
            pathsToUpdate: [],
        });
        expect(findTranslatableTexts({ name: 'test' }, [])).toEqual({
            textsToTranslate: [],
            pathsToUpdate: [],
        });
        expect(findTranslatableTexts(null, ['name'])).toEqual({
            textsToTranslate: [],
            pathsToUpdate: [],
        });
    });

    it('should find simple top-level fields', () => {
        const data = { name: 'Top Name', description: 'Desc', ignored: 'Ignore me' };
        const configPaths = ['name', 'description'];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual(['Top Name', 'Desc']);
        expect(result.pathsToUpdate).toEqual([
            { path: ['name'], originalValue: 'Top Name' },
            { path: ['description'], originalValue: 'Desc' },
        ]);
    });

    it('should ignore empty or non-string top-level fields', () => {
        const data = { name: '', description: null, count: 5 };
        const configPaths = ['name', 'description', 'count'];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual([]);
        expect(result.pathsToUpdate).toEqual([]);
    });

    it('should find nested object fields', () => {
        const data = {
            id: 1,
            purpose: { description: 'Nested Desc', code: 'PUR' },
            other: { value: 'abc' },
        };
        const configPaths = ['purpose.description'];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual(['Nested Desc']);
        expect(result.pathsToUpdate).toEqual([
            { path: ['purpose', 'description'], originalValue: 'Nested Desc' },
        ]);
    });

    it('should find fields within simple arrays', () => {
        const data = {
            id: 2,
            additional: [
                { name: 'Add Name 1', value: 'Add Value 1' },
                { name: 'Add Name 2', value: 'Add Value 2' },
                { name: '', value: 'Empty Name' }, // Should ignore empty name
                { value: 'Missing Name' }, // Should ignore missing name
            ],
        };
        const configPaths = ['additional.[].name', 'additional.[].value'];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual([
            'Add Name 1',
            'Add Value 1',
            'Add Name 2',
            'Add Value 2',
            'Empty Name', // Value for item with empty name
            'Missing Name', // Value for item with missing name
        ]);
        expect(result.pathsToUpdate).toEqual([
            { path: ['additional', 0, 'name'], originalValue: 'Add Name 1' },
            { path: ['additional', 0, 'value'], originalValue: 'Add Value 1' },
            { path: ['additional', 1, 'name'], originalValue: 'Add Name 2' },
            { path: ['additional', 1, 'value'], originalValue: 'Add Value 2' },
            { path: ['additional', 2, 'value'], originalValue: 'Empty Name' },
            { path: ['additional', 3, 'value'], originalValue: 'Missing Name' },
        ]);
    });

    it('should find fields within nested arrays (under objects)', () => {
        const data = {
            id: 3,
            damageV2: {
                action: 'Damage Action',
                additional: [
                    { name: 'Dmg Add Name 1', value: 'Dmg Add Value 1' },
                    { name: 'Dmg Add Name 2', value: 'Dmg Add Value 2' },
                ],
            },
            sensitivityV2: {
                sensitivity: 'High',
                additional: [{ name: 'Sens Add Name', value: 'Sens Add Value' }],
            },
        };
        const configPaths = [
            'damageV2.action',
            'damageV2.additional.[].name',
            'damageV2.additional.[].value',
            'sensitivityV2.sensitivity',
            'sensitivityV2.additional.[].name',
            'sensitivityV2.additional.[].value',
        ];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual([
            'Damage Action',
            'Dmg Add Name 1',
            'Dmg Add Value 1',
            'Dmg Add Name 2',
            'Dmg Add Value 2',
            'High',
            'Sens Add Name',
            'Sens Add Value',
        ]);
        // Check a few key paths for correctness
        expect(result.pathsToUpdate).toContainEqual({
            path: ['damageV2', 'action'],
            originalValue: 'Damage Action',
        });
        expect(result.pathsToUpdate).toContainEqual({
            path: ['damageV2', 'additional', 0, 'name'],
            originalValue: 'Dmg Add Name 1',
        });
        expect(result.pathsToUpdate).toContainEqual({
            path: ['damageV2', 'additional', 1, 'value'],
            originalValue: 'Dmg Add Value 2',
        });
        expect(result.pathsToUpdate).toContainEqual({
            path: ['sensitivityV2', 'sensitivity'],
            originalValue: 'High',
        });
        expect(result.pathsToUpdate).toContainEqual({
            path: ['sensitivityV2', 'additional', 0, 'name'],
            originalValue: 'Sens Add Name',
        });
        expect(result.pathsToUpdate).toContainEqual({
            path: ['sensitivityV2', 'additional', 0, 'value'],
            originalValue: 'Sens Add Value',
        });
        expect(result.pathsToUpdate.length).toBe(8); // Ensure all were found
    });

    it('should handle mixed configurations correctly', () => {
        const data = {
            name: 'Mixed Object',
            details: { description: 'Detail Desc' },
            items: [
                { name: 'Item 1', value: 'Value 1' },
                { name: 'Item 2', value: 'Value 2' },
            ],
            ignored: 'abc',
        };
        const configPaths = ['name', 'details.description', 'items.[].name'];
        const result = findTranslatableTexts(data, configPaths);
        expect(result.textsToTranslate).toEqual([
            'Mixed Object',
            'Detail Desc',
            'Item 1',
            'Item 2',
        ]);
        expect(result.pathsToUpdate).toEqual([
            { path: ['name'], originalValue: 'Mixed Object' },
            { path: ['details', 'description'], originalValue: 'Detail Desc' },
            { path: ['items', 0, 'name'], originalValue: 'Item 1' },
            { path: ['items', 1, 'name'], originalValue: 'Item 2' },
        ]);
    });

    // Add more tests for edge cases if needed (e.g., arrays of strings, deeper nesting)
});
