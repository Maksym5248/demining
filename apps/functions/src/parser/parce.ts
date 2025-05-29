import fs from 'fs';
import path from 'path';

import { parsePDF, generateHtmlFromParsed } from './pdfParser';

(async () => {
    const pdfPath = path.join(__dirname, 'book.pdf');
    const outputDir = path.join(__dirname, 'output');

    console.log(`OutputDir: ${outputDir}`);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagesDir = path.join(outputDir, 'images');
    const fontsDir = path.join(outputDir, 'fonts');
    console.log(`ImagesDir: ${imagesDir}`);

    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    const result = await parsePDF(pdfPath, imagesDir, fontsDir);

    fs.writeFileSync(path.join(outputDir, 'text.json'), JSON.stringify(result, null, 2));

    // Generate HTML output
    const html = generateHtmlFromParsed(result); // No imageBaseUrl argument needed
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);

    console.log('Extraction complete. Text, images, and HTML saved to output/.');
})();
