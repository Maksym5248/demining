import React from 'react';

import { Button, Input } from 'antd';

import { s } from './panel-viewer.styles';
import { Icon } from '../icon';

type PanelViewerProps = {
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

export function PanelViewer({
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
}: PanelViewerProps) {
    const onPrev = () => {
        if (pageNumber > 1) {
            onPageInputChange({ target: { value: pageNumber - 1 } } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const onNext = () => {
        if (numPages && pageNumber < numPages) {
            onPageInputChange({ target: { value: pageNumber + 1 } } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const disablePrev = pageNumber <= 1;
    const disableNext = numPages ? pageNumber >= numPages : true;

    return (
        <>
            <div css={s.panel}>
                <Button onClick={onPrev} disabled={disablePrev} size="small" icon={<Icon.LeftOutlined />} />
                {showPageInput && (
                    <Input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={onPageInputChange}
                        style={{ width: 100, margin: '0 4px' }}
                        suffix={`/ ${numPages}`}
                        size="small"
                    />
                )}
                <Button onClick={onNext} disabled={disableNext} size="small" icon={<Icon.RightOutlined />} />
            </div>
            <div css={s.zoom}>
                {showZoom && (
                    <>
                        <Button onClick={onZoomOut} disabled={disableZoomOut} size="small">
                            -
                        </Button>
                        <span>{(scale * 100).toFixed(0)}%</span>
                        <Button onClick={onZoomIn} disabled={disableZoomIn} size="small">
                            +
                        </Button>
                    </>
                )}
            </div>
            <Button onClick={onOpenComponents} disabled={disableZoomIn} size="small" css={s.components}>
                Компоненти
            </Button>
        </>
    );
}
