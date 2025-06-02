import React from 'react';

import { s } from './books-pdf-preview.styles';

type PdfPanelProps = {
    pageNumber: number;
    numPages?: number;
    onPrev: () => void;
    onNext: () => void;
    showPageInput: boolean;
    onPageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showZoom: boolean;
    scale: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    disablePrev: boolean;
    disableNext: boolean;
    disableZoomIn: boolean;
    disableZoomOut: boolean;
};

export function PdfPanel({
    pageNumber,
    numPages,
    onPrev,
    onNext,
    showPageInput,
    onPageInputChange,
    showZoom,
    scale,
    onZoomIn,
    onZoomOut,
    disablePrev,
    disableNext,
    disableZoomIn,
    disableZoomOut,
}: PdfPanelProps) {
    return (
        <div css={s.panel}>
            <button onClick={onPrev} disabled={disablePrev}>
                Prev
            </button>
            <span>
                Сторінка
                {showPageInput && (
                    <input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={onPageInputChange}
                        style={{ width: 50, margin: '0 4px' }}
                    />
                )}
                з {numPages}
            </span>
            <button onClick={onNext} disabled={disableNext}>
                Next
            </button>
            {showZoom && (
                <>
                    <button onClick={onZoomOut} disabled={disableZoomOut}>
                        -
                    </button>
                    <span>Zoom: {(scale * 100).toFixed(0)}%</span>
                    <button onClick={onZoomIn} disabled={disableZoomIn}>
                        +
                    </button>
                </>
            )}
        </div>
    );
}
