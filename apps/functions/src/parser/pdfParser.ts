import fs from 'fs';
import path from 'path';

import { extractFontsWithMutool } from './extractFonts';
import { mergeTextItems } from './mergeTextItems';
import {
    type HighlightItem,
    type ExtractedText,
    type ParsedPDF,
    type PositionedTextItem,
} from './types';

// Extend TextItem for internal use in parsePDF and HTML generation

async function importEsmModule<T>(name: string): Promise<T> {
    // FIXME: see https://stackoverflow.com/questions/65265420/how-to-prevent-typescript-from-transpiling-dynamic-imports-into-require
    // eslint-disable-next-line no-eval
    const module = eval(`(async () => {return await import("${name}")})()`);
    return module as T;
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
