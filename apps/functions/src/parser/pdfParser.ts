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
): Promise<Pick<IBookAssetsDB, 'pages' | 'metadata' | 'viewport'>> => {
    const { getDocument } = await importEsmModule<any>('pdfjs-dist/legacy/build/pdf.mjs');

    // Ensure imagesDir exists
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    const data = new Uint8Array(fs.readFileSync(pdfPath));

    const loadingTask = getDocument({ data });
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

    // Extract all images with Poppler (with page info) ONCE before the page loop
    const extractedImages = await extractImagesWithPoppler(pdfPath, imagesDir);

    const numPages = pdfDoc.numPages;

    for (let i = 0; i < numPages; i++) {
        const page = await pdfDoc.getPage(i + 1);
        if (!viewport) {
            const vp = page.getViewport({ scale: 1 });
            const widthMM = (vp.width * 25.4) / 72;
            const heightMM = (vp.height * 25.4) / 72;
            viewport = { width: vp.width, height: vp.height, widthMM, heightMM };
        }
        const textContent = await page.getTextContent();
        const mergedText = textContent.items.map((item: any) => item.str).join('');
        const usedImageFilenames = new Set<string>();
        for (let j = 0; j < i; j++) {
            extractedImages
                .filter(img => img.page === j + 1)
                .forEach(img => usedImageFilenames.add(img.filename));
        }
        const imagesForPage = extractedImages.filter(
            img => img.page === i + 1 && !usedImageFilenames.has(img.filename),
        );
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

    return {
        metadata,
        pages,
        viewport,
    };
};
