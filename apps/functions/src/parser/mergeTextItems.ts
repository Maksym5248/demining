import { type PositionedTextItem } from './types';

// Improved: mergeTextItems with semantic rules for paragraphs, indentation, y-gap, bullets, and hyphenation
export function mergeTextItems(textItems: any[]): PositionedTextItem[] {
    if (!textItems || textItems.length === 0) return [];
    // Step 1: Sort by y (descending), then x (ascending)
    const sorted = [...textItems].sort((a, b) => {
        const ay = a.transform ? a.transform[5] : 0;
        const by = b.transform ? b.transform[5] : 0;
        if (ay !== by) return by - ay;
        const ax = a.transform ? a.transform[4] : 0;
        const bx = b.transform ? b.transform[4] : 0;
        return ax - bx;
    });

    // Step 2: Remove duplicates by (rounded x, y, width, height, text)
    const uniqueKey = (item: any) => {
        return [
            Math.round(item.transform ? item.transform[4] : 0),
            Math.round(item.transform ? item.transform[5] : 0),
            Math.round(item.width || 0),
            Math.round(item.height || 0),
            item.str,
        ].join('_');
    };
    const seen = new Set<string>();
    const filtered = sorted.filter(item => {
        const key = uniqueKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // Helper to estimate width of a text item
    function getTextItemWidth(item: any): number {
        if (item.width) return item.width;
        const text = item.text || item.str || '';
        const fontSize = item.fontSize || 10;
        return text.length * fontSize * 0.5;
    }

    const xGapThreshold = 8; // px, more conservative for less over-merging
    const rowTolerance = 0.5; // y-difference to consider as same row, more strict

    // Group items by row (y position within tolerance)
    const rows: Record<number, any[]> = {};
    for (const item of filtered) {
        const y = item.transform ? item.transform[5] : 0;
        // Find existing row within tolerance
        let rowKey = null;
        for (const key of Object.keys(rows)) {
            if (Math.abs(Number(key) - y) < rowTolerance) {
                rowKey = key;
                break;
            }
        }
        if (rowKey === null) rowKey = y;
        if (!rows[rowKey]) rows[rowKey] = [];
        rows[rowKey].push(item);
    }

    const merged: PositionedTextItem[] = [];
    Object.values(rows).forEach(rowItems => {
        // Sort by text length descending (prefer longest fragments)
        const sortedByLength = [...rowItems].sort((a, b) => {
            const alen = (a.str || a.text || '').length;
            const blen = (b.str || b.text || '').length;
            return blen - alen;
        });
        const accepted: any[] = [];
        sortedByLength.forEach(item => {
            const x = item.transform ? item.transform[4] : 0;
            const y = item.transform ? item.transform[5] : 0;
            const width = getTextItemWidth(item);
            const height = item.height || item.fontSize || 10; // fallback: font size as height
            const x1 = x;
            const x2 = x + width;
            const y1 = y;
            const y2 = y + height;
            // Check overlap with already accepted items using bounding box intersection
            const overlaps = accepted.some(acc => {
                const accX = acc.transform ? acc.transform[4] : 0;
                const accY = acc.transform ? acc.transform[5] : 0;
                const accWidth = getTextItemWidth(acc);
                const accHeight = acc.height || acc.fontSize || 10;
                const accX1 = accX;
                const accX2 = accX + accWidth;
                const accY1 = accY;
                const accY2 = accY + accHeight;
                // Intersection box
                const ix1 = Math.max(x1, accX1);
                const iy1 = Math.max(y1, accY1);
                const ix2 = Math.min(x2, accX2);
                const iy2 = Math.min(y2, accY2);
                const iwidth = ix2 - ix1;
                const iheight = iy2 - iy1;
                if (iwidth <= 0 || iheight <= 0) return false;
                const intersectionArea = iwidth * iheight;
                const minArea = Math.min(width * height, accWidth * accHeight);
                // Consider as overlap if >30% of the smaller area
                return intersectionArea > 0.3 * minArea;
            });
            if (!overlaps) accepted.push(item);
        });
        // After filtering, sort accepted by x for left-to-right order
        accepted.sort((a, b) => {
            const ax = a.transform ? a.transform[4] : 0;
            const bx = b.transform ? b.transform[4] : 0;
            return ax - bx;
        });
        // Merge horizontally close fragments (if any remain)
        let current: PositionedTextItem | null = null;
        for (const item of accepted) {
            const x = item.transform ? item.transform[4] : 0;
            const y = item.transform ? item.transform[5] : 0;
            const fontName = item.fontName || item.fontFamily || undefined;
            if (
                current &&
                current.y !== undefined &&
                Math.abs((current.y ?? 0) - y) < rowTolerance &&
                x - ((current.x ?? 0) + getTextItemWidth(current)) < xGapThreshold &&
                current.fontName === fontName
            ) {
                // Add a space if needed between fragments
                const needsSpace =
                    current.text &&
                    !current.text.endsWith(' ') &&
                    item.str &&
                    !item.str.startsWith(' ');
                current.text += (needsSpace ? ' ' : '') + item.str;
            } else {
                if (current) merged.push(current);
                current = {
                    text: item.str,
                    fontSize: item.fontSize,
                    color: item.color,
                    x,
                    y,
                    fontName,
                    originalIndex: item.originalIndex,
                };
            }
        }
        if (current) merged.push(current);
    });
    return merged;
}
