import fs from 'fs';
import path from 'path';

import { parsePDF } from './pdfParser';

(async () => {
    const pdfPath = path.join(__dirname, 'book.pdf');
    const outputDir = path.join(__dirname, 'output');
    const result = await parsePDF(pdfPath, outputDir);

    // Ensure output directories exist
    const imagesDir = path.join(outputDir, 'images');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

    // Save text and highlights as JSON
    const textData = result.pages.map(page => ({
        page: page.page,
        textItems: page.textItems,
        highlights: page.highlights,
    }));
    fs.writeFileSync(
        path.join(outputDir, 'text.json'),
        JSON.stringify({ metadata: result.metadata, pages: textData }, null, 2),
    );

    // Images are already saved by parsePDF
    console.log('Extraction complete. Text and images saved to output/.');
})();
