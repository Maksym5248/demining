import React from 'react';

import { Button, Input } from 'antd';

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
    onOpenComponents: () => void;
    disablePrev: boolean;
    disableNext: boolean;
    disableZoomIn: boolean;
    disableZoomOut: boolean;
};

export function PdfPanel({
    pageNumber,
    numPages,
    showPageInput,
    onPageInputChange,
    showZoom,
    scale,
    onZoomIn,
    onZoomOut,
    disableZoomIn,
    disableZoomOut,
    onOpenComponents,
}: PdfPanelProps) {
    return (
        <div css={s.panel}>
            <Button onClick={onOpenComponents} disabled={disableZoomIn} size="small">
                Компоненти
            </Button>
            <span>
                Сторінка
                {showPageInput && (
                    <Input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={onPageInputChange}
                        style={{ width: 70, margin: '0 4px' }}
                        size="small"
                    />
                )}
                з {numPages}
            </span>

            {showZoom && (
                <>
                    <Button onClick={onZoomOut} disabled={disableZoomOut} size="small">
                        -
                    </Button>
                    <span>Zoom: {(scale * 100).toFixed(0)}%</span>
                    <Button onClick={onZoomIn} disabled={disableZoomIn} size="small">
                        +
                    </Button>
                </>
            )}
        </div>
    );
}
