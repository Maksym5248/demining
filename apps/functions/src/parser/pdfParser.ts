import fs from 'fs';
import path from 'path';

import { extractFontsWithMutool } from './extractFonts';
import { type HighlightItem, type ExtractedText, type ParsedPDF, type TextItem } from './types';

// Extend TextItem for internal use in parsePDF and HTML generation
export interface PositionedTextItem extends TextItem {
    y?: number;
    x?: number;
    newParagraph?: boolean;
    offsetX?: number;
    originalIndex?: number; // Preserve original index for HTML generation
    fontName?: string; // Add fontName for font extraction
    fontWeight?: string | number; // Add fontWeight for style extraction
    fontStyle?: string; // Add fontStyle for style extraction
}

async function importEsmModule<T>(name: string): Promise<T> {
    // FIXME: see https://stackoverflow.com/questions/65265420/how-to-prevent-typescript-from-transpiling-dynamic-imports-into-require
    // eslint-disable-next-line no-eval
    const module = eval(`(async () => {return await import("${name}")})()`);
    return module as T;
}

// Improved: mergeTextItems with semantic rules for paragraphs, indentation, y-gap, bullets, and hyphenation
function mergeTextItems(textItems: any[]): PositionedTextItem[] {
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

export const parsePDF = async (
    pdfPath: string,
    imagesDir: string,
    fontsDir: string,
): Promise<ParsedPDF & { fonts?: Record<string, string | null> }> => {
    const { getDocument } = await importEsmModule<any>('pdfjs-dist/legacy/build/pdf.mjs');
    // Ensure imagesDir exists
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    // Fix: Provide standardFontDataUrl for pdfjs-dist legacy build in Node.js
    const pdfjsDistLegacyPath = require.resolve('pdfjs-dist/legacy/build/pdf.mjs');
    const standardFontDataUrl = path.join(path.dirname(pdfjsDistLegacyPath), 'standard_fonts/');
    const loadingTask = getDocument({ data, standardFontDataUrl });
    const pdfDoc = await loadingTask.promise;
    // Extract metadata
    const meta = await pdfDoc.getMetadata().catch(() => ({}));
    const info = meta && typeof meta === 'object' && 'info' in meta ? meta.info : {};
    const title = info.Title;
    const author = info.Author;
    const subject = info.Subject;
    const keywords = info.Keywords ? info.Keywords.split(',') : [];
    const metadata = { title, author, subject, keywords };
    const pages: ExtractedText[] = [];
    let viewport:
        | { width: number; height: number; widthMM?: number; heightMM?: number }
        | undefined = undefined;
    // Font extraction: collect embedded font files

    // Extract fonts with mutool before parsing PDF.js
    extractFontsWithMutool(pdfPath, fontsDir);
    if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });
    const fontMap: Record<string, string> = {};
    // Use pdfDoc._pdfInfo.numPages for page count if available
    const numPages = pdfDoc.numPages || (pdfDoc._pdfInfo && pdfDoc._pdfInfo.numPages) || 10;
    for (let i = 0; i < Math.min(numPages, 100); i++) {
        const page = await pdfDoc.getPage(i + 1);
        if (!viewport) {
            const vp = page.getViewport({ scale: 1 });
            // 1pt = 1/72 inch, 1 inch = 25.4mm
            const widthMM = (vp.width * 25.4) / 72;
            const heightMM = (vp.height * 25.4) / 72;
            viewport = { width: vp.width, height: vp.height, widthMM, heightMM };
        }
        const textContent = await page.getTextContent();
        // Collect all fontNames used on this page
        const usedFontNames = new Set<string>();
        for (const item of textContent.items) {
            if (item.fontName) usedFontNames.add(item.fontName);
        }
        // Force PDF.js to load font data for each used font
        if (page.commonObjs && typeof page.commonObjs.get === 'function') {
            for (const fontName of Array.from(usedFontNames)) {
                try {
                    page.commonObjs.get(fontName);
                } catch (e) {
                    // Ignore errors if font is not found
                }
            }
        }
        // Try to access font objects by fontName to trigger loading
        if (page.commonObjs && typeof page.commonObjs._objs === 'object') {
            for (const fontName of Array.from(usedFontNames)) {
                const fontObj = page.commonObjs._objs[fontName];
                if (fontObj) {
                    console.log(
                        '[PDF FONT BY NAME]',
                        fontName,
                        fontObj && typeof fontObj === 'object' ? Object.keys(fontObj) : [],
                        {
                            hasData: 'data' in fontObj,
                            dataType:
                                fontObj.data &&
                                fontObj.data.constructor &&
                                fontObj.data.constructor.name,
                            dataLength: fontObj.data && fontObj.data.length,
                            loadedName: fontObj.loadedName,
                            mimetype: fontObj.mimetype,
                        },
                    );
                } else {
                    console.log('[PDF FONT BY NAME NOT FOUND]', fontName);
                }
            }
            // Also log all keys in _objs
            for (const [key, obj] of Object.entries(page.commonObjs._objs)) {
                if (obj && typeof obj === 'object') {
                    console.log('[PDF FONT OBJ]', key, Object.keys(obj));
                } else {
                    console.log('[PDF FONT OBJ]', key, typeof obj);
                }
            }
            // Font extraction: extract embedded font files from PDF.js internals
            for (const [key, obj] of Object.entries(page.commonObjs._objs)) {
                if (obj && typeof obj === 'object' && ('data' in obj || 'loadedName' in obj)) {
                    console.log('[PDF FONT DEBUG]', {
                        key,
                        hasData: 'data' in obj,
                        dataType:
                            obj &&
                            (obj as any).data &&
                            (obj as any).data.constructor &&
                            (obj as any).data.constructor.name,
                        dataLength: obj && (obj as any).data && (obj as any).data.length,
                        loadedName: (obj as any).loadedName,
                        mimetype: (obj as any).mimetype,
                    });
                }
                const data = (obj as any).data;
                const loadedName = (obj as any).loadedName;
                if (
                    obj &&
                    typeof obj === 'object' &&
                    data &&
                    (Array.isArray(data) || data instanceof Uint8Array) &&
                    data.length > 1000 &&
                    typeof loadedName === 'string' &&
                    !fontMap[loadedName]
                ) {
                    const fontObj = obj as {
                        data: Uint8Array | number[];
                        loadedName: string;
                        mimetype?: string;
                    };
                    const ext =
                        fontObj.mimetype && fontObj.mimetype.includes('truetype') ? 'ttf' : 'otf';
                    const fontFileName = `${fontObj.loadedName}.${ext}`;
                    const fontFilePath = path.join(fontsDir, fontFileName);
                    fs.writeFileSync(fontFilePath, Buffer.from(fontObj.data));
                    fontMap[fontObj.loadedName] = `fonts/${fontFileName}`;
                    console.log('[PDF FONT EXTRACTED]', fontFileName, fontFilePath);
                }
            }
        }
        // Use helper to merge text items
        const mergedTextItems = mergeTextItems(textContent.items);
        // Extract highlights (annotations)
        const annotations = await page.getAnnotations();
        const highlights: HighlightItem[] = annotations
            .filter((ann: any) => ann.subtype === 'Highlight')
            .map((ann: any) => ({
                text: ann.contents || '',
                quadPoints: ann.quadPoints || [],
            }));
        pages.push({
            page: i + 1,
            textItems: mergedTextItems,
            images: [],
            highlights,
        });
    }
    // Extract images using Poppler
    // const images = await extractImagesWithPoppler(pdfPath, imagesDir);
    // // Distribute images to pages (do not attach to text items)
    // images.forEach(img => {
    //     const pageIdx = Math.max(0, Math.min(pages.length - 1, img.page - 1));
    //     const page = pages[pageIdx];
    //     // Fallback: if y is undefined, distribute images between text items
    //     const textYs = (page.textItems as PositionedTextItem[])
    //         .map(ti => ti.y ?? 0)
    //         .sort((a, b) => b - a);
    //     if (img.y === undefined) {
    //         let y = 0;
    //         if (textYs.length > 1) {
    //             const idx = page.images.length % (textYs.length - 1);
    //             y = (textYs[idx] + textYs[idx + 1]) / 2;
    //         } else if (textYs.length === 1) {
    //             y = textYs[0] - 10 * (page.images.length + 1);
    //         } else {
    //             y = 1000 - 100 * (page.images.length + 1);
    //         }
    //         img.y = y;
    //     }
    //     if (!page.images) page.images = [];
    //     page.images.push(img);
    // });
    // After all pages processed, build a map of all used font names to file (or null)
    const allUsedFontNames = new Set<string>();
    pages.forEach(page => {
        (page.textItems as PositionedTextItem[]).forEach(ti => {
            if (ti.fontName) allUsedFontNames.add(ti.fontName);
        });
    });
    // Map extracted font files (font-0.ttf, font-1.otf, etc) to font names (best effort)
    const fontFiles = fs
        .readdirSync(fontsDir)
        .filter(f => f.startsWith('font-') && (f.endsWith('.ttf') || f.endsWith('.otf')));
    // Heuristic: assign font files in order to font names (order is not guaranteed to match, but better than nothing)
    const fonts: Record<string, string | null> = {};
    const fontNames = Array.from(allUsedFontNames);
    for (let i = 0; i < fontNames.length; i++) {
        fonts[fontNames[i]] = fontFiles[i] ? `fonts/${fontFiles[i]}` : null;
    }
    return {
        metadata,
        pages,
        viewport,
        fonts,
    };
};

// Generate HTML from parsed PDF data
export function generateHtmlFromParsed(
    parsed: ParsedPDF & { fonts?: Record<string, string | null> },
): string {
    const viewport = parsed.viewport || { width: 800, height: 1000 };
    // PDF points to CSS pixels: 1pt = 1.333px (96/72)
    const scale = 96 / 72;
    // If real size in mm is available, use it for CSS size (1mm = 3.7795px)
    let pageWidth = viewport.width * scale;
    let pageHeight = viewport.height * scale;
    if ('widthMM' in viewport && 'heightMM' in viewport && viewport.widthMM && viewport.heightMM) {
        pageWidth = viewport.widthMM * 3.7795;
        pageHeight = viewport.heightMM * 3.7795;
    }
    // Emit @font-face rules for extracted fonts
    let fontFaceCss = '';
    if (parsed.fonts) {
        for (const [fontName, fontPath] of Object.entries(parsed.fonts)) {
            fontFaceCss += `@font-face { font-family: '${fontName}'; src: url('${fontPath}'); font-display: swap; }\n`;
        }
    }
    let html =
        `<!DOCTYPE html
<html>
<head>
<meta charset="utf-8">
<title>${parsed.metadata.title || 'PDF Extract'}</title>
<style>
` +
        fontFaceCss +
        `body { font-family: sans-serif; background: #eee; }
.page { background: #fff; margin: 2em auto; box-shadow: 0 0 8px #aaa; width: ${pageWidth}px; height: ${pageHeight}px; padding: 0; position: relative; }
.text-block { position: absolute; white-space: pre; }
` +
        `</style>
</head>
<body>`;
    parsed.pages.forEach(page => {
        html += `<div class="page">`;
        const placedBoxes: Array<{ left: number; top: number; right: number; bottom: number }> = [];
        (page.textItems as PositionedTextItem[]).forEach((ti, idx) => {
            let left = ti.x !== undefined ? ti.x * scale : 0;
            const fontSize = ti.fontSize || 10;
            const width = (ti.text ? ti.text.length : 1) * (fontSize * scale) * 0.5;
            const top =
                ti.y !== undefined && viewport.height ? (viewport.height - ti.y) * scale : 0;
            const height = fontSize * scale;
            let right = left + width;
            const bottom = top + height;
            // Check for overlap and shift right if needed
            let shift = 0;
            placedBoxes.forEach(box => {
                const ix1 = Math.max(left, box.left);
                const iy1 = Math.max(top, box.top);
                const ix2 = Math.min(right, box.right);
                const iy2 = Math.min(bottom, box.bottom);
                if (ix2 > ix1 && iy2 > iy1) {
                    // Overlap: compute shift needed
                    const neededShift = box.right - left + 1; // +1px gap
                    if (neededShift > shift) shift = neededShift;
                }
            });
            if (shift > 0) {
                left += shift;
                right = left + width;
            }
            placedBoxes.push({ left, top, right, bottom });
            const styleParts = [
                `left:${left}px`,
                `top:${Math.round(top)}px`,
                `font-size:${fontSize * scale}px`,
                ti.color ? `color:${ti.color}` : '',
                ti.fontName ? `font-family:'${ti.fontName}', sans-serif` : '',
                ti.fontWeight ? `font-weight:${ti.fontWeight}` : '',
                ti.fontStyle ? `font-style:${ti.fontStyle}` : '',
                `z-index:${ti.originalIndex ?? idx}`,
            ].filter(Boolean);
            html += `<span class="text-block" style="${styleParts.join(';')}">${ti.text}</span>`;
        });
        // Render images for this page
        (page.images || []).forEach(img => {
            if (img.x !== undefined && img.y !== undefined && img.width && img.height) {
                const left = img.x * scale;
                const top = (viewport.height - img.y - img.height) * scale;
                const width = img.width * scale;
                const height = img.height * scale;
                html += `<img src="images/${img.filename}" style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:0;" alt="image" />`;
            }
        });
        html += `</div>`;
    });
    html += `</body></html>`;
    // Remove unnecessary escape characters in HTML
    html = html.replace(/\\"/g, '"');
    return html;
}
