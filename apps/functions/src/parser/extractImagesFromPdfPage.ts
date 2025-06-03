import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Filters images for a given page from a directory where pdfimages has already been run.
 * @param imagesDir Directory to search for images
 * @param pageIndex 0-based page index (for naming)
 * @returns Promise<string[]> Array of saved image file paths for the page
 */
export async function extractImagesFromPdfPage(
    page: any, // not used, but kept for API compatibility
    imagesDir: string,
    pageIndex: number,
    pdfPath: string, // not used anymore, but kept for API compatibility
): Promise<string[]> {
    void pdfPath; // avoid unused param warning
    // pdfimages names images like p-001-001.png, p-002-001.jpg, etc. (prefix-page-image)
    const pageNum = (pageIndex + 1).toString().padStart(3, '0');
    let patterns: RegExp[] = [];
    if (pageIndex === 0) {
        // Match both p-000.png and p-001.png for the first page
        patterns = [
            /^p-000\.(png|jpg|jpeg|ppm|pbm|tif|tiff)$/i,
            /^p-001(?:-\d+)?\.(png|jpg|jpeg|ppm|pbm|tif|tiff)$/i,
        ];
    } else {
        patterns = [new RegExp(`^p-${pageNum}(?:-\\d+)?\\.(png|jpg|jpeg|ppm|pbm|tif|tiff)$`, 'i')];
    }
    const files = fs
        .readdirSync(imagesDir)
        .filter(f => patterns.some(pattern => pattern.test(f)))
        .map(f => path.join(imagesDir, f));
    return files;
}

/**
 * Run pdfimages ONCE for the whole PDF, before per-page extraction.
 * @param pdfPath Path to the PDF file
 * @param imagesDir Directory to save images
 * @returns Promise<void>
 */
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
