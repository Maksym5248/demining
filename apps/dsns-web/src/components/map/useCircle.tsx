import { useCallback, useMemo, useRef } from 'react';

import { DrawingType, type ICircle, type ILine, type IPolygon } from 'shared-my-client';
import { mapUtils } from 'shared-my-client';

interface IUseCircleParams {
    isCreating: boolean;
    setCreating: (value: boolean) => void;
    drawing: DrawingType;
    circle?: ICircle;
    setPolygon: (value?: IPolygon | undefined) => void;
    setLine: (value?: ILine | undefined) => void;
    setCircle: (value?: ICircle | undefined) => void;
}

export interface IUseCircleReturn {
    isVisibleCircle: boolean;
    onLoadCircle: (newCircleRef: google.maps.Circle) => void;
    onRadiusChanged: () => void;
    onDragCircleEnd: () => void;
    clear: () => void;
    onClickMap: (e: google.maps.MapMouseEvent) => void;
    onMouseMove: (e: google.maps.MapMouseEvent) => void;
}

export function useCircle({
    isCreating,
    setCreating,
    drawing,
    circle,
    setPolygon,
    setLine,
    setCircle,
}: IUseCircleParams): IUseCircleReturn {
    const circleRef = useRef<google.maps.Circle>();

    const onLoadCircle = useCallback((newCircleRef: google.maps.Circle) => {
        circleRef.current = newCircleRef;
    }, []);

    const onRadiusChanged = useCallback(() => {
        if (circleRef.current) {
            const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
            const circleRadius = circleRef.current?.getRadius();

            setCircle({ center: mapUtils.createPointLiteral(circleCenter), radius: circleRadius });
        }
    }, []);

    const onDragCircleEnd = useCallback(() => {
        if (!circleRef.current) return;

        const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
        const circleRadius = circleRef.current?.getRadius();
        const value = { center: mapUtils.createPointLiteral(circleCenter), radius: circleRadius };

        setCircle(value);
    }, []);

    const clear = useCallback(() => {
        setCircle(undefined);
    }, []);

    const onClickMap = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng) return;

            const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

            if (drawing === DrawingType.CIRCLE && isCreating) {
                setCreating(false);
            }

            if (drawing === DrawingType.CIRCLE && !isCreating && !circle) {
                setCreating(true);
                setPolygon(undefined);
                setLine(undefined);
                setCircle({
                    center: point,
                    radius: 0,
                });
            }
        },
        [drawing, isCreating, circle],
    );

    const onMouseMove = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e?.latLng || !circle?.center) return;

            if (drawing === DrawingType.CIRCLE && isCreating) {
                const currentPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                const value = {
                    ...circle,
                    radius: mapUtils.getDistanceByPoints(circle?.center, currentPosition),
                };

                setCircle(value);
            }
        },
        [circle, isCreating, drawing],
    );

    const isVisibleCircle = !!circle?.center && !!circle?.radius;

    return useMemo(
        () => ({
            isVisibleCircle,
            onLoadCircle,
            onRadiusChanged,
            onDragCircleEnd,
            clear,
            onClickMap,
            onMouseMove,
        }),
        [isVisibleCircle, onLoadCircle, onRadiusChanged, onDragCircleEnd, clear, onClickMap, onMouseMove],
    );
}
