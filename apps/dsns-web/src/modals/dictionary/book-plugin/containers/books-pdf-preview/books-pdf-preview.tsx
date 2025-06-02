import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { Button } from 'antd';
import { get, set } from 'idb-keyval';
import { observer } from 'mobx-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAsyncEffect } from 'shared-my-client';

import { Loading } from '~/components';
import { STORAGE } from '~/constants';
import { useStore } from '~/hooks';
import { Storage } from '~/services';

import { s } from './books-pdf-preview.styles';
import { type IBooksPdfPreviewProps } from './books-pdf-preview.types';
import { PdfPanel } from './PdfPanel';
import { PdfSettingsPanel } from './PdfSettingsPanel';

// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

// Helper keys for settings and page state

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
    const [pageNumber, setPageNumber] = useState<number>(Storage.get(STORAGE.PAGE_KEY_PREFIX + id) ?? 1);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scale, setScale] = useState<number>(1.0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [showPanel, setShowPanel] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showPageInput, setShowPageInput] = useState(true);
    const [showZoom, setShowZoom] = useState(true);
    const lastPageLoaded = useRef(false);

    useLayoutEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update containerWidth when scale changes (to trigger Page rerender)
    useLayoutEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, [scale]);

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
        } catch (e) {
            console.log('Fetching PDF blob for 3:', e);
        } finally {
            setIsLoading(false);
        }
    }, [item?.data.uri]);

    // Load settings and last page from idb-keyval
    useEffect(() => {
        const settings = Storage.get(STORAGE.SETTINGS_KEY);
        if (settings && typeof settings === 'object') {
            const s = settings;
            if (typeof s.showPanel === 'boolean') setShowPanel(s.showPanel);
            if (typeof s.showPageInput === 'boolean') setShowPageInput(s.showPageInput);
            if (typeof s.showZoom === 'boolean') setShowZoom(s.showZoom);
        }
        let lastPage = Storage.get(STORAGE.PAGE_KEY_PREFIX + id);
        if (typeof lastPage === 'string') {
            lastPage = parseInt(lastPage, 10);
        }
        if (typeof lastPage === 'number' && !isNaN(lastPage) && lastPage > 0) {
            setPageNumber(lastPage);
            lastPageLoaded.current = true;
        } else {
            lastPageLoaded.current = false;
        }
    }, [id]);

    // Save settings on change
    useEffect(() => {
        Storage.set(STORAGE.SETTINGS_KEY, {
            showPanel,
            showPageInput,
            showZoom,
        });
    }, [showPanel, showPageInput, showZoom]);

    useEffect(() => {
        Storage.set(STORAGE.PAGE_KEY_PREFIX + id, pageNumber); // Save as number, not string
    }, [id, pageNumber]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        // Only set page 1 if last page was not loaded from storage
        setPageNumber(prev => (lastPageLoaded.current ? prev : 1));
    }

    const goToPrevPage = () => setPageNumber(p => Math.max(1, p - 1));
    const goToNextPage = () => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1));
    const zoomIn = () => setScale(s => Math.min(s + 0.1, 3));
    const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
    const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && numPages && val >= 1 && val <= numPages) {
            setPageNumber(val);
        }
    };

    if (book.fetchItem.isLoading || isLoading) {
        return <Loading />;
    }

    return (
        <div ref={containerRef} css={[s.container]}>
            <Button size="small" onClick={() => setShowSettings(true)} css={s.settingsButton} aria-label="Open PDF settings">
                ⚙️
            </Button>
            {showSettings && (
                <PdfSettingsPanel
                    showPanel={showPanel}
                    setShowPanel={setShowPanel}
                    showPageInput={showPageInput}
                    setShowPageInput={setShowPageInput}
                    showZoom={showZoom}
                    setShowZoom={setShowZoom}
                    onClose={() => setShowSettings(false)}
                />
            )}
            {showPanel && (
                <PdfPanel
                    pageNumber={pageNumber}
                    numPages={numPages}
                    onPrev={goToPrevPage}
                    onNext={goToNextPage}
                    showPageInput={showPageInput}
                    onPageInputChange={onPageInputChange}
                    showZoom={showZoom}
                    scale={scale}
                    onZoomIn={zoomIn}
                    onZoomOut={zoomOut}
                    disablePrev={pageNumber <= 1}
                    disableNext={numPages ? pageNumber >= numPages : false}
                    disableZoomIn={scale >= 3}
                    disableZoomOut={scale <= 0.4}
                />
            )}
            <div css={s.pdfContent}>
                <Document file={pdfBlob} onLoadSuccess={onDocumentLoadSuccess} loading={<Loading />}>
                    <Page
                        pageNumber={pageNumber}
                        width={containerWidth ? containerWidth * scale : undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                    />
                </Document>
            </div>
        </div>
    );
});
