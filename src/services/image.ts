import html2canvas from 'html2canvas';

class ImageClass {
	async takeMapImage(selector: string) {
		const canvas = await html2canvas(document.querySelector(selector) as HTMLElement, {
			backgroundColor: null,
			useCORS: true
		});

		const image = canvas.toDataURL("image/png", 1.0);

		return image;
	}
}

export const Image = new ImageClass();
