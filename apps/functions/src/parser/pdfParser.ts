import fs from 'fs';
import path from 'path';

// import { getDocument, OPS } from 'pdfjs-dist';
// import { getDocument, OPS } from 'pdfjs-dist';
import { v4 as uuid } from 'uuid';

interface ExtractedImage {
    id: string;
    filename: string;
    page: number;
}

interface TextItem {
    text: string;
    fontSize?: number;
    color?: string;
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

async function importEsmModule<T>(name: string): Promise<T> {
    // FIXME: see https://stackoverflow.com/questions/65265420/how-to-prevent-typescript-from-transpiling-dynamic-imports-into-require
    // eslint-disable-next-line no-eval
    const module = eval(`(async () => {return await import("${name}")})()`);
    return module as T;
}

export const parsePDF = async (pdfPath: string, outputDir: string): Promise<ParsedPDF> => {
    const { getDocument, OPS } = await importEsmModule<any>('pdfjs-dist/legacy/build/pdf.mjs');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
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

    const pages: ExtractedText[] = [];

    for (let i = 0; i < pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i + 1);
        const textContent = await page.getTextContent();
        const textItems: TextItem[] = textContent.items.map((item: any) => ({
            text: item.str,
        }));

        // Extract highlights (annotations)
        const annotations = await page.getAnnotations();
        const highlights: HighlightItem[] = annotations
            .filter((ann: any) => ann.subtype === 'Highlight')
            .map((ann: any) => ({
                text: ann.contents || '',
                quadPoints: ann.quadPoints || [],
            }));

        // Extract images (inline images as raw buffers)
        const images: ExtractedImage[] = [];
        const ops = await page.getOperatorList();
        const objs = page.objs;
        for (let j = 0; j < ops.fnArray.length; j++) {
            if (ops.fnArray[j] === OPS.paintImageXObject) {
                const imgName = ops.argsArray[j][0];
                await new Promise(resolve => {
                    objs.get(imgName, (img: any) => {
                        if (img && img.data) {
                            const imageId = uuid();
                            const imageFilename = `${imageId}.png`;
                            const imagePath = path.join(outputDir, imageFilename);
                            fs.writeFileSync(imagePath, Buffer.from(img.data));
                            images.push({
                                id: imageId,
                                filename: imageFilename,
                                page: i + 1,
                            });
                        }
                        resolve(null);
                    });
                });
            }
        }

        pages.push({
            page: i + 1,
            textItems,
            images,
            highlights,
        });
    }

    return {
        metadata,
        pages,
    };
};
