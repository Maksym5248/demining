import { type MutableRefObject, useRef } from 'react';

import { DrawingType, mapUtils } from 'shared-my-client';
import { type ICircle, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

interface IUseLineParams {
    isCreating: boolean;
    setCreating: (value: boolean) => void;
    drawing: DrawingType;
    line?: ILine;
    setPolygon: (value?: IPolygon | undefined) => void;
    setCircle: (value?: ICircle) => void;
    setLine: (value?: ILine | undefined) => void;
    polygons?: IPolygon[];
    isActiveStick: boolean;
    defaultWidth?: number;
    mapRef?: MutableRefObject<google.maps.Map | undefined>;
}

export function useLine({ isCreating, setCreating, drawing, line, defaultWidth = 1, setPolygon, setCircle, setLine }: IUseLineParams) {
    const polylineRef = useRef<google.maps.Polyline>();

    const onLoadPolyline = (newPolylineRef: google.maps.Polyline) => {
        polylineRef.current = newPolylineRef;
    };

    const appendPoint = (value: IPoint) => {
        if (line?.points.length) {
            setLine({ points: [...line.points, value], width: line.width });
        } else {
            setLine({ points: [value], width: defaultWidth });
        }
    };

    const onDragEndPolyline = () => {
        if (!polylineRef.current) return;

        const points = polylineRef.current?.getPath();

        if (!points.getLength()) return;

        const value = points.getArray().map((point) => mapUtils.createPointLiteral(point));
        setLine({ points: value, width: line?.width || defaultWidth });
    };

    const clear = () => {
        setLine(undefined);
    };

    const onClickMap = (e: google.maps.MapMouseEvent) => {
        if (!e?.latLng || drawing !== DrawingType.LINE) return;

        const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        if (!isCreating && !line?.points.length) {
            setCreating(true);
            setCircle(undefined);
            setPolygon(undefined);
        }

        appendPoint(point);
    };

    const onMouseUpPolyline = (e: google.maps.MapMouseEvent) => {
        if (!e?.latLng) return;
        onDragEndPolyline();
    };

    const onChangeLineWidth = (value: number | null) => {
        setLine({ points: line?.points ?? [], width: value ?? defaultWidth });
    };

    const isVisiblePolyline = line?.points.length;
    const isVisiblePolygon = (line?.points?.length ?? 0) >= 2;
    const isVisiblePolylineInput = drawing === DrawingType.LINE && (line?.points.length ?? 0) > 1;

    return {
        isVisiblePolyline,
        isVisiblePolygon,
        isVisiblePolylineInput,
        value: line,
        onDragEndPolyline,
        onLoadPolyline,
        onClickMap,
        onMouseUpPolyline,
        onChangeLineWidth,
        clear,
    };
}
