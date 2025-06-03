// Removed unused imports: ParsedPDF, PositionedTextItem

// Accepts new ParsedPDFPage[] structure with items[]
export function generateHtmlFromParsed(parsed: {
    metadata: any;
    pages: { page: number; items: { type: 'text' | 'image'; value: string }[] }[];
    viewport?: any;
    fonts?: Record<string, string | null>;
}): string {
    const viewport = parsed.viewport || { width: 800, height: 1000 };
    // PDF points to CSS pixels: 1pt = 1.333px (96/72)
    const scale = 96 / 72;
    // If real size in mm is available, use it for CSS size (1mm = 3.7795px)
    let pageWidth = viewport.width * scale;
    let pageHeight = viewport.height * scale;
    if ('widthMM' in viewport && 'heightMM' in viewport && viewport.widthMM && viewport.heightMM) {
        pageWidth = viewport.widthMM * 3.7795;
        pageHeight = viewport.heightMM * 3.7795;
    }
    // Emit @font-face rules for extracted fonts
    let fontFaceCss = '';
    if (parsed.fonts) {
        for (const [fontName, fontPath] of Object.entries(parsed.fonts)) {
            fontFaceCss += `@font-face { font-family: '${fontName}'; src: url('${fontPath}'); font-display: swap; }\n`;
        }
    }
    let html =
        `<!DOCTYPE html
            <html>
            <head>
            <meta charset="utf-8">
            <title>${parsed.metadata.title || 'PDF Extract'}</title>
            <style>
            ` +
        fontFaceCss +
        `body { font-family: sans-serif; background: #eee; }
            .page { background: #fff; margin: 2em auto; box-shadow: 0 0 8px #aaa; width: ${pageWidth}px; height: ${pageHeight}px; padding: 2em; position: relative; }
            .text-block { display: block; margin-bottom: 1em; white-space: pre-wrap; }
            img.pdf-image { display: block; max-width: 100%; margin: 1em 0; }
            ` +
        `</style>
            </head>
            <body>`;
    parsed.pages.forEach(page => {
        html += `<div class="page">`;
        page.items.forEach(item => {
            if (item.type === 'text') {
                html += `<span class="text-block">${item.value}</span>`;
            } else if (item.type === 'image') {
                // Convert absolute path to relative path for browser
                let relPath = item.value;
                // Try to make path relative to the HTML file (assume HTML is in output/ and images in output/images/)
                const outputIdx = relPath.lastIndexOf('/output/');
                if (outputIdx !== -1) {
                    relPath = relPath.substring(outputIdx + 8); // remove up to and including '/output/'
                }
                // Remove leading slashes if any
                relPath = relPath.replace(/^\/+/, '');
                // Also handle Windows backslashes
                relPath = relPath.replace(/\\/g, '/');
                html += `<img class="pdf-image" src="${relPath}" alt="image" />`;
            }
        });
        html += `</div>`;
    });
    html += `</body></html>`;
    // Remove unnecessary escape characters in HTML
    html = html.replace(/\\"/g, '"');
    return html;
}
