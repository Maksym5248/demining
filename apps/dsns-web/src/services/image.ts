import html2canvas from 'html2canvas';

export interface IImage {
    takeMapImage(selector: string): Promise<string>;
}
export class ImageClass implements IImage {
    async takeMapImage(selector: string) {
        const canvas = await html2canvas(document.querySelector(selector) as HTMLElement, {
            backgroundColor: null,
            useCORS: true,
        });

        const image = canvas.toDataURL('image/png', 1.0);

        return image;
    }
}
