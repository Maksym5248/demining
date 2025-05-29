import { exec } from 'child_process';
import fs from 'fs';

export function extractFontsWithMutool(pdfPath: string, fontsDir: string) {
    // Ensure output directory exists
    if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir, { recursive: true });
    }

    // Use cwd to ensure extraction happens in the correct directory
    const absPdfPath = fs.realpathSync(pdfPath);
    const absFontsDir = fs.realpathSync(fontsDir);
    const command = `mutool extract "${absPdfPath}"`;

    exec(command, { cwd: absFontsDir }, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error extracting fonts:', error.message);
            return;
        }
        if (stderr) {
            console.warn('⚠️ stderr:', stderr);
        }
        console.log('✅ Fonts and resources extracted to:', absFontsDir);

        // Optionally, list extracted files
        const files = fs.readdirSync(absFontsDir);
        console.log('Number of extracted files:', files.length);
        files.forEach(file => {
            if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.cff')) {
                console.log('📝 Found font:', file);
            }
        });
    });
}
