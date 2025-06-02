import { useState } from 'react';

import { get, set } from 'idb-keyval';
import { observer } from 'mobx-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsyncEffect } from 'shared-my-client';

import { Loading } from '~/components';
import { useStore } from '~/hooks';

import { type IBooksPdfPreviewProps } from './books-pdf-preview.types';

// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
async function cacheAsset(uri: string): Promise<Blob | null> {
    if (!uri) return null;
    const cached = await get(uri);
    if (cached) return cached as Blob;
    const response = await fetch(uri);
    const blob = await response.blob();
    await set(uri, blob);
    return blob;
}

export const BooksPdfPreview = observer(({ id }: IBooksPdfPreviewProps) => {
    const { book } = useStore();
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const item = book.collection.get(id);

    useAsyncEffect(async () => {
        if (!item) {
            await book.fetchItem.run(id);
        }
    }, [id]);

    useAsyncEffect(async () => {
        try {
            if (!item?.data.uri) return;
            setIsLoading(true);
            const blob = await cacheAsset(item.data.uri);
            if (blob) setPdfBlob(blob);
        } finally {
            setIsLoading(false);
        }
    }, [item?.data.uri]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const onChange = (newPageNumber: number): void => {
        setPageNumber(newPageNumber);
    };

    if (book.fetchItem.isLoading || isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Document file={pdfBlob} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} onChange={onChange} />
            </Document>
            <p>
                Сторінка {pageNumber} of {numPages}
            </p>
        </div>
    );
});
