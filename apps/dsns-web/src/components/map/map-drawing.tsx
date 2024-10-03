import { memo } from 'react';

import { Marker, Circle, Polygon, Polyline } from '@react-google-maps/api';
import { InputNumber } from 'antd';
import { mapUtils } from 'shared-my-client';

import { useMapOptions } from '~/hooks';

import { s } from './map-view.style';
import { type IMapDrawingProps } from './map.types';

function Component({ marker, circle, line, polygon, drawing, isCreating, circleManager, polygonManager, lineManager }: IMapDrawingProps) {
    const { polygonOptions, circleOptions, createPolygonOptions, lineOptions, linePolygonOptions } = useMapOptions({
        isPictureType: false,
        isCreating,
        drawing,
    });

    const isVisibleMarker = !!marker;

    return (
        <>
            {isVisibleMarker && <Marker position={marker} />}
            {circleManager.isVisibleCircle && (
                <Circle
                    onLoad={circleManager.onLoadCircle}
                    options={circleOptions}
                    radius={circle?.radius ?? 0}
                    center={circle?.center ?? { lat: 0, lng: 0 }}
                    onRadiusChanged={circleManager.onRadiusChanged}
                    onDragEnd={circleManager.onDragCircleEnd}
                />
            )}
            {polygonManager.isVisiblePolygon && (
                <Polygon
                    onLoad={polygonManager.onLoadPolygon}
                    options={polygonOptions}
                    path={polygon?.points}
                    onDragEnd={polygonManager.onDragEndPolygon}
                    onMouseUp={polygonManager.onMouseUpPolygon}
                />
            )}
            {polygonManager.isVisiblePolyline && (
                <Polyline
                    onLoad={polygonManager.onLoadPolyline}
                    path={polygon?.points}
                    options={createPolygonOptions}
                    onDragEnd={polygonManager.onDragEndPolyline}
                    onMouseUp={polygonManager.onMouseUpPolyline}
                />
            )}
            {lineManager.isVisiblePolyline && (
                <Polyline
                    onLoad={lineManager.onLoadPolyline}
                    path={line?.points}
                    options={lineOptions}
                    onDragEnd={lineManager.onDragEndPolyline}
                    onMouseUp={lineManager.onMouseUpPolyline}
                />
            )}
            {lineManager.isVisiblePolygon && !!line && (
                <Polygon options={linePolygonOptions} path={mapUtils.generatePolygonFromLines(line)?.points} />
            )}
            {lineManager.isVisiblePolylineInput && (
                <div css={s.inputNumberContainer}>
                    <InputNumber
                        addonBefore="Ширина"
                        addonAfter="м"
                        value={line?.width}
                        onChange={lineManager.onChangeLineWidth}
                        css={s.inputNumber}
                        disabled={false}
                    />
                </div>
            )}
        </>
    );
}

export const MapDrawing = memo(Component);
