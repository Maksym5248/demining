import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

interface ExtractedImage {
    id: string;
    filename: string;
    page: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

interface TextItem {
    text: string;
    fontSize?: number;
    color?: string;
    newLine?: boolean;
    imageName?: string; // Reference to an image if this text item is associated with one
}

interface HighlightItem {
    text: string;
    quadPoints: number[][];
}

interface ExtractedText {
    page: number;
    textItems: TextItem[];
    images: ExtractedImage[];
    highlights: HighlightItem[];
}

interface ParsedPDF {
    metadata: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string[];
    };
    pages: ExtractedText[];
    viewport?: { width: number; height: number; widthMM?: number; heightMM?: number };
}

// Extend TextItem for internal use in parsePDF and HTML generation
export interface PositionedTextItem extends TextItem {
    y?: number;
    x?: number;
    newParagraph?: boolean;
    offsetX?: number;
    originalIndex?: number; // Preserve original index for HTML generation
}

async function importEsmModule<T>(name: string): Promise<T> {
    // FIXME: see https://stackoverflow.com/questions/65265420/how-to-prevent-typescript-from-transpiling-dynamic-imports-into-require
    // eslint-disable-next-line no-eval
    const module = eval(`(async () => {return await import("${name}")})()`);
    return module as T;
}

// Helper to parse pdfimages -list output
function parsePdfImagesList(listOutput: string, outputDir: string): ExtractedImage[] {
    const lines = listOutput.split('\n').filter(l => l.trim() && !l.startsWith('page'));
    const images: ExtractedImage[] = [];
    for (const line of lines) {
        // pdfimages -list output columns: page num type width height color comp bpc enc interp object ID x-ppi y-ppi size ratio
        // Example: 1   0 image  100  200  ...  10  20  ...
        const parts = line.trim().split(/\s+/);
        if (parts.length < 11) continue;
        const page = parseInt(parts[0], 10);
        const num = parts[1];
        const width = parseInt(parts[4], 10);
        const height = parseInt(parts[5], 10);
        // x and y are not directly available, but we can try to parse if present (Poppler 24+)
        let x, y;
        if (parts.length >= 15) {
            x = parseInt(parts[13], 10);
            y = parseInt(parts[14], 10);
        }
        // Find the corresponding PNG file
        const filename = `image-${num}.png`;
        const fullPath = path.join(outputDir, filename);

        if (fs.existsSync(fullPath)) {
            images.push({
                id: filename.replace('.png', ''),
                filename,
                page,
                x,
                y,
                width,
                height,
            });
        }
    }
    return images;
}

export async function extractImagesWithPoppler(
    pdfPath: string,
    imagesDir: string, // <-- use imagesDir directly
): Promise<ExtractedImage[]> {
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
    return new Promise((resolve, reject) => {
        const prefix = path.join(imagesDir, 'image'); // <-- use imagesDir for prefix
        execFile('pdfimages', ['-list', pdfPath], (error, stdout, stderr) => {
            if (error) {
                reject(new Error(stderr || error.message));
                return;
            }
            // Extract images as PNGs
            execFile('pdfimages', ['-png', pdfPath, prefix], err2 => {
                if (err2) {
                    reject(new Error(err2.message));
                    return;
                }
                // Parse -list output for positions
                const images = parsePdfImagesList(stdout, imagesDir);
                resolve(images);
            });
        });
    });
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
            if (
                current &&
                current.y !== undefined &&
                Math.abs((current.y ?? 0) - y) < rowTolerance &&
                x - ((current.x ?? 0) + getTextItemWidth(current)) < xGapThreshold
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
                    originalIndex: item.originalIndex,
                };
            }
        }
        if (current) merged.push(current);
    });
    return merged;
}

export const parsePDF = async (pdfPath: string, imagesDir: string): Promise<ParsedPDF> => {
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
    for (let i = 0; i < 10; i++) {
        const page = await pdfDoc.getPage(i + 1);
        if (!viewport) {
            const vp = page.getViewport({ scale: 1 });
            // 1pt = 1/72 inch, 1 inch = 25.4mm
            const widthMM = (vp.width * 25.4) / 72;
            const heightMM = (vp.height * 25.4) / 72;
            viewport = { width: vp.width, height: vp.height, widthMM, heightMM };
        }
        const textContent = await page.getTextContent();

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
    //     // --- FIX: Actually push to the correct page.images array ---
    //     if (!page.images) page.images = [];
    //     page.images.push(img);
    // });

    return {
        metadata,
        pages,
        viewport,
    };
};

// Generate HTML from parsed PDF data
export function generateHtmlFromParsed(parsed: ParsedPDF): string {
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
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${parsed.metadata.title || 'PDF Extract'}</title><style>
        body { font-family: sans-serif; background: #eee; }
        .page { background: #fff; margin: 2em auto; box-shadow: 0 0 8px #aaa; width: ${pageWidth}px; height: ${pageHeight}px; padding: 0; position: relative; }
        .text-block { position: absolute; white-space: pre; }
    </style></head><body>`;
    parsed.pages.forEach(page => {
        html += `<div class="page">`;
        (page.textItems as PositionedTextItem[]).forEach((ti, idx) => {
            const styleParts = [
                ti.x !== undefined ? `left:${ti.x * scale}px` : '',
                ti.y !== undefined && viewport.height
                    ? `top:${(viewport.height - ti.y) * scale}px`
                    : '', // invert y for html, scale
                ti.fontSize ? `font-size:${ti.fontSize * scale}px` : '',
                ti.color ? `color:${ti.color}` : '',
                `z-index:${ti.originalIndex ?? idx}`,
            ].filter(Boolean);
            html += `<span class="text-block" style="${styleParts.join(';')}">${ti.text}</span>`;
        });
        html += `</div>`;
    });
    html += `</body></html>`;
    return html;
}
