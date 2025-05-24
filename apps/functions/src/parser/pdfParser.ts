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
}

// Extend TextItem for internal use in parsePDF and HTML generation
export interface PositionedTextItem extends TextItem {
    y?: number;
    x?: number;
    newParagraph?: boolean;
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
function mergeTextItems(textItems: any[], forceTocMode = false): PositionedTextItem[] {
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

    // Step 2: Merge items with the same y (line)
    // Remove duplicates by (rounded x, y, width, height, text)
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

    // Group items by y (line)
    const yGroups = new Map<number, any[]>();
    for (const item of filtered) {
        const y = item.transform ? item.transform[5] : 0;
        const yKey = Math.round(y * 10) / 10; // round to avoid floating point issues
        if (!yGroups.has(yKey)) yGroups.set(yKey, []);
        yGroups.get(yKey)!.push(item);
    }

    // For each line, filter out overlapping items
    const lines: {
        y: number;
        x: number;
        text: string;
        fontSize?: number;
        minX: number;
        maxX: number;
        height: number;
        width: number;
    }[] = [];
    for (const [yKey, items] of Array.from(yGroups.entries())) {
        // Sort by x
        const sortedByX = items.slice().sort((a: any, b: any) => {
            const ax = a.transform ? a.transform[4] : 0;
            const bx = b.transform ? b.transform[4] : 0;
            return ax - bx;
        });
        // Filter out overlapping items
        const nonOverlapping: any[] = [];
        for (const item of sortedByX) {
            const x1 = item.transform ? item.transform[4] : 0;
            const w1 = item.width || 0;
            const end1 = x1 + w1;
            let overlaps = false;
            for (const kept of nonOverlapping) {
                const x2 = kept.transform ? kept.transform[4] : 0;
                const w2 = kept.width || 0;
                const end2 = x2 + w2;
                // Check for significant overlap (at least 50% of the smaller width)
                const overlap = Math.max(0, Math.min(end1, end2) - Math.max(x1, x2));
                const minWidth = Math.min(w1, w2);
                if (overlap > 0.5 * minWidth) {
                    if ((item.str?.length || 0) > (kept.str?.length || 0)) {
                        const idx = nonOverlapping.indexOf(kept);
                        if (idx !== -1) nonOverlapping[idx] = item;
                    }
                    overlaps = true;
                    break;
                }
            }
            if (!overlaps) {
                nonOverlapping.push(item);
            }
        }
        // Now merge non-overlapping items into a line
        let lineText = '';
        let fontSize = undefined;
        let lastX = undefined;
        let minX = Infinity;
        let maxX = -Infinity;
        let maxHeight = 0;
        let totalWidth = 0;
        for (const item of nonOverlapping) {
            const x = item.transform ? item.transform[4] : 0;
            const w = item.width || 0;
            if (lastX !== undefined) {
                const gap = x - lastX;
                const spaceThreshold = item.fontSize ? Math.max(item.fontSize * 0.5, 2.5) : 2.5;
                if (gap > spaceThreshold) lineText += ' ';
            }
            lineText += item.str;
            if (item.fontSize && !fontSize) fontSize = item.fontSize;
            lastX = x + w;
            if (x < minX) minX = x;
            if (x + w > maxX) maxX = x + w;
            if (item.height && item.height > maxHeight) maxHeight = item.height;
            totalWidth += w;
        }
        if (minX === Infinity) minX = 0;
        if (maxX === -Infinity) maxX = 0;
        lines.push({
            y: parseFloat(yKey.toFixed(4)),
            x: minX,
            text: lineText,
            fontSize,
            minX,
            maxX,
            height: maxHeight,
            width: totalWidth,
        });
    }

    // --- Merge lines into paragraphs, detect newLine using y, height, and x position ---
    const mergedLines: {
        y: number;
        x: number;
        text: string;
        fontSize?: number;
        minX: number;
        maxX: number;
        height: number;
        width: number;
        newLine?: boolean;
    }[] = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const prevLine = i > 0 ? lines[i - 1] : null;
        let isNewLine = false;
        if (prevLine) {
            // If y difference is greater than half the average height, or x jumps left, treat as new line
            const avgHeight = (prevLine.height + line.height) / 2 || 1;
            const yGap = Math.abs(line.y - prevLine.y);
            if (yGap > 0.5 * avgHeight || line.x < prevLine.x - 2) isNewLine = true;
        }
        mergedLines.push({ ...line, newLine: isNewLine });
    }

    // --- Зміст: приєднувати номери сторінок до попереднього рядка, якщо це лише число ---
    const finalLines: {
        y: number;
        x: number;
        text: string;
        fontSize?: number;
        newLine?: boolean;
    }[] = [];
    for (let i = 0; i < mergedLines.length; i++) {
        const line = mergedLines[i];
        if (/^\d+$/.test(line.text.trim()) && finalLines.length > 0) {
            finalLines[finalLines.length - 1].text += ' ' + line.text.trim();
            // If the merged line hadEOL, preserve it
            if (line.newLine) finalLines[finalLines.length - 1].newLine = true;
        } else {
            finalLines.push(line);
        }
    }

    // Calculate median x and y gap for heuristics
    const xVals = finalLines.map(l => l.x).sort((a, b) => a - b);
    const yGaps = finalLines.slice(1).map((l, i) => Math.abs(l.y - finalLines[i].y));
    const median = (arr: number[]) => (arr.length ? arr[Math.floor(arr.length / 2)] : 0);
    const medianX = median(xVals);
    const medianYGap = median(yGaps);

    // Step 3: Mark newLine for lines with large y-gap or hasEOL
    const linesWithBreaks: {
        y: number;
        x: number;
        text: string;
        fontSize?: number;
        newLine?: boolean;
    }[] = [];
    for (let i = 0; i < finalLines.length; i++) {
        const line = finalLines[i];
        const prevLine = i > 0 ? finalLines[i - 1] : null;
        const yGap = prevLine ? Math.abs(line.y - prevLine.y) : 0;
        // Mark newLine if previous line hadEOL or y-gap is large
        const isNewLine = (prevLine && prevLine.newLine) || (prevLine && yGap > 1.2 * medianYGap);
        linesWithBreaks.push({ ...line, newLine: !!isNewLine });
    }

    // Step 4: Merge lines into paragraphs, but break paragraph on newLine
    let currentPara: {
        x: number;
        lines: {
            y: number;
            text: string;
            newLine?: boolean;
        }[];
    } | null = null;
    const paragraphs: {
        x: number;
        lines: {
            y: number;
            text: string;
            newLine?: boolean;
        }[];
    }[] = [];
    for (let i = 0; i < linesWithBreaks.length; i++) {
        const line = linesWithBreaks[i];
        const prevLine = i > 0 ? linesWithBreaks[i - 1] : null;
        const indent = Math.abs(line.x - medianX);
        const isIndented = indent > 10;
        const isBullet = /^\s*([\u2022\-*\u25CF]|\d+\.)\s+/.test(line.text);
        // Hyphenation: if previous line ends with hyphen, merge without space
        if (
            currentPara &&
            !isIndented &&
            !isBullet &&
            prevLine &&
            prevLine.text.trim().endsWith('-')
        ) {
            currentPara.lines[currentPara.lines.length - 1].text =
                currentPara.lines[currentPara.lines.length - 1].text.trim().replace(/-$/, '') +
                line.text.trimStart();
            continue;
        }
        if (!currentPara || isIndented || isBullet || line.newLine) {
            if (currentPara) paragraphs.push(currentPara);
            currentPara = {
                x: line.x,
                lines: [
                    {
                        y: line.y,
                        text: line.text,
                        newLine: line.newLine,
                    },
                ],
            };
        } else {
            currentPara.lines.push({
                y: line.y,
                text: line.text,
                newLine: line.newLine,
            });
        }
    }
    if (currentPara) paragraphs.push(currentPara);

    if (forceTocMode) {
        // TOC mode: every line ending with a number is a separate paragraph
        const tocParagraphs: PositionedTextItem[] = [];
        for (const para of paragraphs) {
            for (const line of para.lines) {
                if (/\d+$/.test(line.text.trim())) {
                    tocParagraphs.push({
                        text: line.text.trim(),
                        x: para.x,
                        y: line.y,
                        newLine: line.newLine,
                    });
                } else if (line.text.trim().length > 0) {
                    // If not ending with a number, still output as a paragraph (for headings etc.)
                    tocParagraphs.push({
                        text: line.text.trim(),
                        x: para.x,
                        y: line.y,
                        newLine: line.newLine,
                    });
                }
            }
        }
        return tocParagraphs;
    } else {
        // Normal mode: output paragraphs as merged
        const result: PositionedTextItem[] = [];
        for (const para of paragraphs) {
            for (let i = 0; i < para.lines.length; i++) {
                const line = para.lines[i];
                if (line.text.trim().length > 0) {
                    result.push({
                        text: line.text.trim(),
                        x: para.x,
                        y: line.y,
                        newLine: line.newLine,
                    });
                }
            }
        }
        return result;
    }

    // After merging lines, remove repeated substrings in each line (robust logic)
    function regexEscape(str: string): string {
        // Escapes special regex characters in a string
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    function removeRepeatedSubstring(text: string): string {
        // Remove any repeated substring (with or without a space or punctuation in between)
        let changed = true;
        while (changed) {
            changed = false;
            // Try substrings from longest to shortest (min 3 chars)
            for (let len = Math.floor(text.length / 2); len >= 3; len--) {
                for (let i = 0; i <= text.length - 2 * len; i++) {
                    const sub = text.substr(i, len);
                    if (!sub.trim() || sub.length < 3) continue;
                    // Allow optional whitespace or punctuation between repeats
                    const pattern = new RegExp(
                        regexEscape(sub) + '[s.,;:–—-]{0,3}' + regexEscape(sub),
                        'g',
                    );
                    if (pattern.test(text)) {
                        text = text.replace(pattern, sub);
                        changed = true;
                    }
                }
            }
        }
        // Remove short repeated patterns at the start (e.g. 'ТМТМТМ --57' -> 'ТМ-57')
        const shortRepeat = text.match(/^(.{2,3})\1{1,}/);
        if (shortRepeat) {
            return shortRepeat[1] + text.slice(shortRepeat[0].length);
        }
        return text;
    }
    for (let i = 0; i < lines.length; i++) {
        lines[i].text = removeRepeatedSubstring(lines[i].text);
    }
}

export const parsePDF = async (
    pdfPath: string,
    imagesDir: string,
    forceTocMode = false,
): Promise<ParsedPDF> => {
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

    for (let i = 0; i < 10; i++) {
        const page = await pdfDoc.getPage(i + 1);
        const textContent = await page.getTextContent();

        // Use helper to merge text items
        const mergedTextItems = mergeTextItems(textContent.items, forceTocMode);

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
    };
};

// Generate HTML from parsed PDF data
export function generateHtmlFromParsed(parsed: ParsedPDF): string {
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${parsed.metadata.title || 'PDF Extract'}</title><style>
        body { font-family: sans-serif; line-height: 1.6; }
        .img-block { margin: 1em 0; }
        .text-block { margin: 0.2em 0; display: inline; }
        .page { margin-bottom: 2em; }
    </style></head><body>`;
    parsed.pages.forEach(page => {
        html += `<div class="page"><h2>Page ${page.page}</h2>`;
        // Merge and sort text and images by y (descending, PDF origin is bottom-left)
        const items: Array<
            | { type: 'text'; y: number; x: number; item: PositionedTextItem }
            | { type: 'image'; y: number; x: number; item: ExtractedImage }
        > = [];
        (page.textItems as PositionedTextItem[]).forEach(ti => {
            items.push({ type: 'text', y: ti.y ?? 0, x: ti.x ?? 0, item: ti });
        });
        page.images.forEach(img => {
            items.push({ type: 'image', y: img.y ?? 0, x: img.x ?? 0, item: img });
        });
        items.sort((a, b) => b.y - a.y || a.x - b.x); // y descending, then x ascending
        items.forEach(entry => {
            if (entry.type === 'text') {
                const ti = entry.item;
                // Add <br> for new lines
                if (ti.newLine) html += '<br/>';
                const styleParts = [];
                if (ti.fontSize && ti.fontSize !== 14) {
                    styleParts.push(`font-size:${ti.fontSize}px`);
                }
                if (ti.color && ti.color !== '#222') {
                    styleParts.push(`color:${ti.color}`);
                }
                const styleAttr = styleParts.length ? ` style="${styleParts.join(';')}"` : '';
                html += `<span class="text-block"${styleAttr}>${ti.text}</span> `;
            } else if (entry.type === 'image') {
                const img = entry.item;
                html += `<div class="img-block"><img src="images/${img.filename}" width="${img.width || ''}" height="${img.height || ''}"/></div>`;
            }
        });
        html += `</div>`;
    });
    html += `</body></html>`;
    return html;
}
