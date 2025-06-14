import { type MutableRefObject, useCallback, useMemo, useRef } from 'react';

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

export interface IUseLineReturn {
    isVisiblePolyline: boolean;
    isVisiblePolygon: boolean;
    isVisiblePolylineInput: boolean;
    value?: ILine;
    onDragEndPolyline: () => void;
    onLoadPolyline: (newPolylineRef: google.maps.Polyline) => void;
    onClickMap: (e: google.maps.MapMouseEvent) => void;
    onMouseUpPolyline: (e: google.maps.MapMouseEvent) => void;
    onChangeLineWidth: (value: number | null) => void;
    clear: () => void;
}

export function useLine({
    isCreating,
    drawing,
    line,
    defaultWidth = 1,
    setCreating,
    setPolygon,
    setCircle,
    setLine,
}: IUseLineParams): IUseLineReturn {
    const polylineRef = useRef<google.maps.Polyline>(null);

    const onLoadPolyline = useCallback((newPolylineRef: google.maps.Polyline) => {
        polylineRef.current = newPolylineRef;
    }, []);

    const appendPoint = useCallback(
        (value: IPoint) => {
            if (line?.points.length) {
                setLine({ points: [...line.points, value], width: line.width });
            } else {
                setLine({ points: [value], width: defaultWidth });
            }
        },
        [line, defaultWidth],
    );

    const onDragEndPolyline = useCallback(() => {
        if (!polylineRef.current) return;

        const points = polylineRef.current?.getPath();

        if (!points.getLength()) return;

        const value = points.getArray().map(point => mapUtils.createPointLiteral(point));
        setLine({ points: value, width: line?.width || defaultWidth });
    }, [line, defaultWidth]);

    const clear = useCallback(() => {
        setLine(undefined);
    }, []);

    const onClickMap = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng || drawing !== DrawingType.LINE) return;

            const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

            if (!isCreating && !line?.points.length) {
                setCreating(true);
                setCircle(undefined);
                setPolygon(undefined);
            }

            appendPoint(point);
        },
        [drawing, line, isCreating, appendPoint],
    );

    const onMouseUpPolyline = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng) return;
            onDragEndPolyline();
        },
        [onDragEndPolyline],
    );

    const onChangeLineWidth = useCallback(
        (value: number | null) => {
            setLine({ points: line?.points ?? [], width: value ?? defaultWidth });
        },
        [line],
    );

    const isVisiblePolyline = !!line?.points.length;
    const isVisiblePolygon = (line?.points?.length ?? 0) >= 2;
    const isVisiblePolylineInput = drawing === DrawingType.LINE && (line?.points.length ?? 0) > 1;

    return useMemo(
        () => ({
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
        }),
        [
            isVisiblePolyline,
            isVisiblePolygon,
            isVisiblePolylineInput,
            line,
            onDragEndPolyline,
            onLoadPolyline,
            onClickMap,
            onMouseUpPolyline,
            onChangeLineWidth,
            clear,
        ],
    );
}
