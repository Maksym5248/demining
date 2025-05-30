import { type ParsedPDF, type PositionedTextItem } from './types';

// Generate HTML from parsed PDF data
export function generateHtmlFromParsed(
    parsed: ParsedPDF & { fonts?: Record<string, string | null> },
): string {
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
            .page { background: #fff; margin: 2em auto; box-shadow: 0 0 8px #aaa; width: ${pageWidth}px; height: ${pageHeight}px; padding: 0; position: relative; }
            .text-block { position: absolute; white-space: pre; }
            ` +
        `</style>
            </head>
            <body>`;
    parsed.pages.forEach(page => {
        html += `<div class="page">`;
        const placedBoxes: Array<{ left: number; top: number; right: number; bottom: number }> = [];
        (page.textItems as PositionedTextItem[]).forEach((ti, idx) => {
            let left = ti.x !== undefined ? ti.x * scale : 0;
            const fontSize = ti.fontSize || 10;
            const width = (ti.text ? ti.text.length : 1) * (fontSize * scale) * 0.5;
            const top =
                ti.y !== undefined && viewport.height ? (viewport.height - ti.y) * scale : 0;
            const height = fontSize * scale;
            let right = left + width;
            const bottom = top + height;
            // Check for overlap and shift right if needed
            let shift = 0;
            placedBoxes.forEach(box => {
                const ix1 = Math.max(left, box.left);
                const iy1 = Math.max(top, box.top);
                const ix2 = Math.min(right, box.right);
                const iy2 = Math.min(bottom, box.bottom);
                if (ix2 > ix1 && iy2 > iy1) {
                    // Overlap: compute shift needed
                    const neededShift = box.right - left + 1; // +1px gap
                    if (neededShift > shift) shift = neededShift;
                }
            });
            if (shift > 0) {
                left += shift;
                right = left + width;
            }
            placedBoxes.push({ left, top, right, bottom });
            const styleParts = [
                `left:${left}px`,
                `top:${Math.round(top)}px`,
                `font-size:${fontSize * scale}px`,
                ti.color ? `color:${ti.color}` : '',
                ti.fontName ? `font-family:'${ti.fontName}', sans-serif` : '',
                ti.fontWeight ? `font-weight:${ti.fontWeight}` : '',
                ti.fontStyle ? `font-style:${ti.fontStyle}` : '',
                `z-index:${ti.originalIndex ?? idx}`,
            ].filter(Boolean);
            html += `<span class="text-block" style="${styleParts.join(';')}">${ti.text}</span>`;
        });
        // Render images for this page
        (page.images || []).forEach(img => {
            if (img.x !== undefined && img.y !== undefined && img.width && img.height) {
                const left = img.x * scale;
                const top = (viewport.height - img.y - img.height) * scale;
                const width = img.width * scale;
                const height = img.height * scale;
                html += `<img src="images/${img.filename}" style="position:absolute;left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:0;" alt="image" />`;
            }
        });
        html += `</div>`;
    });
    html += `</body></html>`;
    // Remove unnecessary escape characters in HTML
    html = html.replace(/\\"/g, '"');
    return html;
}
