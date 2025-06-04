import fs from 'fs';
import path from 'path';

import { type IBookAssetsItemDB, type IBookAssetsDB, type IBookAssetsPageDB } from 'shared-my';

import { extractImagesWithPoppler } from './extractImages';
import { importEsmModule } from './utils';

// Extend TextItem for internal use in parsePDF and HTML generation

// Define new type for merged items

export const parsePDF = async (
    pdfPath: string,
    imagesDir: string,
    fontsDir: string,
): Promise<Pick<IBookAssetsDB, 'pages' | 'metadata' | 'viewport'>> => {
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
    const pages: IBookAssetsPageDB[] = [];
    let viewport:
        | { width: number; height: number; widthMM?: number; heightMM?: number }
        | undefined = undefined;
    // Font extraction: collect embedded font files

    // Extract fonts with mutool before parsing PDF.js

    if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });
    // Use pdfDoc._pdfInfo.numPages for page count if available
    const numPages = pdfDoc.numPages || (pdfDoc._pdfInfo && pdfDoc._pdfInfo.numPages) || 10;

    // Extract all images with Poppler (with page info) ONCE before the page loop
    const extractedImages = await extractImagesWithPoppler(pdfPath, imagesDir);

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
        const mergedText = textContent.items.map((item: any) => item.str).join('');
        // Get images for this page using extractedImages with page info
        // Skip images that were already used on previous pages
        const usedImageFilenames = new Set<string>();
        for (let j = 0; j < i; j++) {
            extractedImages
                .filter(img => img.page === j + 1)
                .forEach(img => usedImageFilenames.add(img.filename));
        }
        const imagesForPage = extractedImages.filter(
            img => img.page === i + 1 && !usedImageFilenames.has(img.filename),
        );
        // Build items array: merge text and images, respecting newlines
        const items: IBookAssetsItemDB[] = [];
        if (mergedText) {
            const textLines = mergedText.split(/\r?\n/);
            textLines.forEach((line: string, idx: number) => {
                if (idx > 0) items.push({ type: 'text', value: '\n' });
                if (line) items.push({ type: 'text', value: line });
            });
        }
        for (const img of imagesForPage) {
            items.push({ type: 'image', value: path.join(imagesDir, img.filename) });
        }
        pages.push({
            page: i + 1,
            items,
        });
    }
    // After all pages processed, build a map of all used font names to file (or null)
    // Remove textItems/PositionedTextItem logic, as we now only have items[]
    const allUsedFontNames = new Set<string>();
    // If you want to collect font names from text items, you can do so from textContent.items if needed
    // But for now, skip this step if not needed for your output
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
    };
};
