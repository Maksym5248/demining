import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function extractImagesFromPdfPage(
    imagesDir: string,
    pdfPath: string, // not used anymore, but kept for API compatibility
): Promise<string[]> {
    void pdfPath; // avoid unused param warning
    // Collect all images in the directory, sorted by name
    const allImages = fs
        .readdirSync(imagesDir)
        .filter(f => f.match(/\.(png|jpg|jpeg|ppm|pbm|tif|tiff)$/i))
        .sort()
        .map(f => path.join(imagesDir, f));
    return allImages;
}

export async function extractAllImagesWithPdfimages(
    pdfPath: string,
    imagesDir: string,
): Promise<void> {
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }
    const absPdfPath = fs.realpathSync(pdfPath);
    const absImagesDir = fs.realpathSync(imagesDir);
    // Use prefix 'p' for output images
    const command = `pdfimages -all "${absPdfPath}" p`;
    await new Promise<void>((resolve, reject) => {
        exec(command, { cwd: absImagesDir }, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Error extracting images with pdfimages:', error.message);
                reject(error);
                return;
            }
            if (stderr) {
                console.warn('⚠️ stderr:', stderr);
            }
            resolve();
        });
    });
}
