import { useEffect, useState } from 'react';

import { observer } from 'mobx-react';
import { pdfjs } from 'react-pdf';
import { useItemStore } from 'shared-my-client';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { type IBooksPdfAssetsProps } from './books-pdf-assets.types';
import { usePDF } from '../../use-pdf';

export const BooksPdfAssets = observer(({ id, pageNumber }: IBooksPdfAssetsProps) => {
    const { book } = useStore();
    const current = useItemStore(book, id);
    const pdf = usePDF(current.item?.data.uri);
    const [textContent, setTextContent] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        async function extractAssets() {
            if (!pdf.file || !pageNumber) return;
            // Convert Blob to ArrayBuffer for pdfjs
            const arrayBuffer = await pdf.file.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;
            const page = await doc.getPage(pageNumber);

            // Extract text
            const text = await page.getTextContent();
            setTextContent(text.items.map((item: any) => item.str).join(' '));

            // Extract images
            const opList = await page.getOperatorList();
            const imgs: string[] = [];
            const objs = page.objs;
            for (let i = 0; i < opList.fnArray.length; i++) {
                const fn = opList.fnArray[i];
                if (fn === pdfjs.OPS.paintImageXObject) {
                    const imgName = opList.argsArray[i][0];
                    const imgObj = objs.get(imgName);
                    if (imgObj && imgObj.data) {
                        const canvas = document.createElement('canvas');
                        canvas.width = imgObj.width;
                        canvas.height = imgObj.height;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            const imageData = ctx.createImageData(imgObj.width, imgObj.height);
                            imageData.data.set(imgObj.data);
                            ctx.putImageData(imageData, 0, 0);
                            imgs.push(canvas.toDataURL());
                        }
                    }
                }
            }
            setImages(imgs);
        }
        extractAssets();
    }, [pdf.file, pageNumber]);

    if (current.isLoading || pdf.isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <h3>Text Content</h3>
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>{textContent}</div>
            <h3>Images</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {images.length === 0 && <div>No images found.</div>}
                {images.map((src, idx) => (
                    <img key={idx} src={src} alt={''} style={{ maxWidth: 200, maxHeight: 200, border: '1px solid #ccc' }} />
                ))}
            </div>
        </div>
    );
});
