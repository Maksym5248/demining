import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';

import { type ExtractedImage } from './types';

// Helper to parse pdfimages -list output
function parsePdfImagesList(listOutput: string, outputDir: string): ExtractedImage[] {
    const lines = listOutput.split('\n').filter(l => l.trim() && !l.startsWith('page'));
    const images: ExtractedImage[] = [];
    let fileIdx = 0;
    for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        const parts = line.trim().split(/\s+/);
        if (parts.length < 11) continue;
        const page = parseInt(parts[0], 10);
        const width = parseInt(parts[4], 10);
        const height = parseInt(parts[5], 10);
        let x, y;
        if (parts.length >= 15) {
            x = parseInt(parts[13], 10);
            y = parseInt(parts[14], 10);
        }
        // Only add if the corresponding file exists, increment fileIdx accordingly
        const filename = `image-${String(fileIdx).padStart(3, '0')}.png`;
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
            fileIdx++;
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
                console.log('images', images);
                resolve(images);
            });
        });
    });
}
