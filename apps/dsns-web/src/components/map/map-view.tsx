import { memo, useEffect, useRef, useState } from 'react';

import { GoogleMap, Marker, Circle, Polygon, Polyline } from '@react-google-maps/api';
import { InputNumber } from 'antd';
import { DrawingType, mathUtils, useValues } from 'shared-my-client';
import { mapUtils, type ICircle, type ILine, type IMarker, type IPoint, type IPolygon, useVisibleMap } from 'shared-my-client';

import { MAP_ZOOM } from '~/constants';
import { withMapProvider } from '~/hoc';
import { useMapOptions } from '~/hooks';

import { s } from './map-view.style';
import { type IMapViewProps } from './map.types';
import { useCircle } from './useCircle';
import { useLine } from './useLine';
import { usePolygon } from './usePolygon';
import { Autocomplete } from '../map-autocomplete';
import { DrawingManager } from '../map-drawing-manager';
import { MapInfo } from '../map-info';
import { MapZoomView } from '../map-zoom-view';

const circlesOptions = {
    fillOpacity: 0.3,
    fillColor: '#FFFF00',
    strokeColor: '#FFFF00',
    strokeWeight: 2,
    draggable: false,
    editable: false,
    clickable: false,
};

const polygonsOptions = {
    fillOpacity: 0.3,
    fillColor: '#FFFF00',
    strokeColor: '#FFFF00',
    strokeWeight: 2,
    draggable: false,
    editable: false,
    clickable: false,
};

function Component({
    initialMarker,
    initialCircle,
    initialPolygon,
    initialZoom,
    initialLine,
    onChange,
    position,
    circles,
    polygons,
    lines,
    onChangeGeobox,
    onChangeEditing,
    isLoadingVisibleInArea,
    minZoomLoadArea = 16,
    initialIsActiveStick = false,
    initialIsVisibleInArea = false,
    ...rest
}: IMapViewProps) {
    const [drawing, setDrawing] = useState(DrawingType.MOVE);
    const [isCreating, setCreating] = useState(false);

    const { mapOptions, polygonOptions, circleOptions, createPolygonOptions, toggleMapType, lineOptions, linePolygonOptions } =
        useMapOptions({ isPictureType: false, isCreating, drawing });

    const mapRef = useRef<google.maps.Map>();

    const [isActiveStick, setActiveStick] = useState(initialIsActiveStick);
    const [isVisibleInArea, setVisibleInArea] = useState(initialIsVisibleInArea);
    const values = useValues();

    const initialCenter = mapUtils.getCenter({
        marker: initialMarker,
        circle: initialCircle,
        polygon: initialPolygon,
        line: initialLine,
    });

    const [center, setCenter] = useState<IMarker | undefined>(initialCenter ?? position);
    const [marker, setMarker] = useState<IMarker | undefined>(initialMarker);
    const [circle, setCircle] = useState<ICircle | undefined>(initialCircle);
    const [line, setLine] = useState<ILine | undefined>(initialLine);
    const [polygon, setPolygon] = useState<IPolygon | undefined>(initialPolygon);
    const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);

    const isVisibleMap = useVisibleMap({ mapRef });

    const area = mapUtils.getArea(circle, polygon, line);

    const _onChange = () => {
        onChange?.({
            marker: marker
                ? {
                      lat: mathUtils.toFixed(marker?.lat, 9),
                      lng: mathUtils.toFixed(marker?.lng, 9),
                  }
                : undefined,
            line:
                !!line && (line?.points?.length ?? 0) >= 2
                    ? {
                          points: line.points.map((el) => ({
                              lat: mathUtils.toFixed(el.lat, 9),
                              lng: mathUtils.toFixed(el.lng, 9),
                          })),
                          width: line.width,
                      }
                    : undefined,
            polygon: polygon
                ? {
                      points: polygon.points.map((el) => ({
                          lat: mathUtils.toFixed(el.lat, 9),
                          lng: mathUtils.toFixed(el.lng, 9),
                      })),
                  }
                : undefined,
            circle: circle
                ? {
                      center: {
                          lat: mathUtils.toFixed(circle?.center.lat, 9),
                          lng: mathUtils.toFixed(circle?.center.lng, 9),
                      },
                      radius: mathUtils.toFixed(circle?.radius, 9),
                  }
                : undefined,
            zoom: mathUtils.toFixed(zoom, 9),
            area,
        });
    };

    useEffect(() => {
        if (values.get('isInitialized') && (!isCreating || drawing === DrawingType.LINE)) {
            _onChange();
        }

        values.set('isInitialized', true);
    }, [polygon, circle, marker, zoom, line, isCreating]);

    const _onChangeGeobox = () => {
        if (!onChangeGeobox || !mapRef.current || !isVisibleInArea) return;
        const box = mapUtils.getGeoBox(mapRef.current);

        if (!box) return;
        onChangeGeobox?.({ box, zoom: mapRef.current.getZoom() as number });
    };

    const onChangeVisibleInArea = (value: boolean) => {
        setVisibleInArea(value);

        if (!value || !mapRef.current) return;
        const box = mapUtils.getGeoBox(mapRef.current);

        if (!box) return;
        onChangeGeobox?.({ box, zoom: mapRef.current.getZoom() as number });
    };

    const lineManager = useLine({
        isCreating,
        setCreating,
        drawing,
        line,
        setPolygon,
        setCircle,
        setLine,
        polygons,
        isActiveStick,
        mapRef,
    });

    const polygonManager = usePolygon({
        isCreating,
        setCreating,
        drawing,
        polygon,
        setPolygon,
        setCircle,
        setLine,
        polygons,
        isActiveStick,
        mapRef,
    });

    const circleManager = useCircle({
        isCreating,
        setCreating,
        drawing,
        circle,
        setPolygon,
        setCircle,
        setLine,
    });

    const onLoadMap = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const onPlaceChanged = ({ point }: { point: IPoint }) => {
        if (!point) {
            return;
        }

        setMarker(point);
        setCenter(point);
        mapRef?.current?.setCenter(point);

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(point);
        mapRef?.current?.fitBounds(bounds);
    };

    const onZoomChanged = () => {
        if (!mapRef?.current) return;
        setZoom(mapRef.current.getZoom() as number);
    };

    const onChangeZoomView = (value: number) => {
        if (!mapRef?.current) return;
        mapRef?.current?.setZoom(value);
    };

    useEffect(() => {
        if (initialZoom && isVisibleMap) {
            mapRef?.current?.setZoom(initialZoom);
        }
    }, [isVisibleMap]);

    const onClear = () => {
        setMarker(undefined);
        setCreating(false);
        circleManager.clear();
        polygonManager.clear();
        lineManager.clear();
    };

    const onClickMap = (e: google.maps.MapMouseEvent) => {
        if (!e?.latLng) return;

        const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        if (drawing === DrawingType.MARKER) {
            setMarker(point);
        }

        if (drawing === DrawingType.CIRCLE) {
            circleManager.onClickMap(e);
        }

        if (drawing === DrawingType.LINE) {
            lineManager.onClickMap(e);
        }

        if (drawing === DrawingType.POLYGON) {
            polygonManager.onClickMap(e);
        }
    };

    const onMouseMove = (e: google.maps.MapMouseEvent) => {
        if (!e?.latLng || !circle?.center) return;

        if (drawing === DrawingType.CIRCLE) {
            circleManager.onMouseMove(e);
        }
    };

    const onChangeDrawing = (value: DrawingType) => {
        setDrawing(value);
    };

    const isVisibleMarker = !!marker;
    const isEditing =
        !!polygonManager.isVisiblePolygon ||
        !!circleManager.isVisibleCircle ||
        !!isVisibleMarker ||
        !!polygonManager.isVisiblePolyline ||
        !!lineManager.isVisiblePolyline;

    const isChangeEditing = (isEditing && !isCreating) || !!lineManager.isVisiblePolyline;

    useEffect(() => {
        if (!values.get('isInitializedCreating')) {
            values.set('isInitializedCreating', true);
            return;
        }

        onChangeEditing?.(isChangeEditing);
    }, [isChangeEditing]);

    return (
        <div css={s.container}>
            <GoogleMap
                mapContainerStyle={s.mapContainerStyle}
                zoom={zoom}
                center={center}
                options={{
                    ...mapOptions,
                    draggableCursor: drawing === DrawingType.MOVE ? 'grab' : 'crosshair',
                }}
                onZoomChanged={onZoomChanged}
                onLoad={onLoadMap}
                onClick={onClickMap}
                onMouseMove={onMouseMove}
                onBoundsChanged={_onChangeGeobox}
                {...rest}>
                <DrawingManager
                    mapTypeId={mapOptions.mapTypeId}
                    onToggleMapType={toggleMapType}
                    canVisibleInArea={zoom > minZoomLoadArea}
                    onChange={onChangeDrawing}
                    value={drawing}
                    onClear={onClear}
                    isActiveStick={isActiveStick}
                    isVisibleInArea={isVisibleInArea}
                    onChangeVisibleInArea={onChangeVisibleInArea}
                    onChangeStick={setActiveStick}
                    isDisabledClean={!isEditing}
                    isLoadingVisibleInArea={isLoadingVisibleInArea}
                />
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
                {isVisibleInArea &&
                    !!circles?.length &&
                    circles.map((item, index) => (
                        <Circle
                            key={index}
                            options={circlesOptions}
                            radius={item?.radius ?? 0}
                            center={item?.center ?? { lat: 0, lng: 0 }}
                        />
                    ))}
                {isVisibleInArea &&
                    !!polygons?.length &&
                    polygons.map((item, index) => <Polygon key={index} options={polygonsOptions} path={item?.points} />)}
                {isVisibleInArea &&
                    !!lines?.length &&
                    lines.map((item, index) => <Polygon key={index} options={polygonsOptions} path={item?.points} />)}
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
                <Autocomplete onPlaceChanged={onPlaceChanged} />
                <MapZoomView zoom={zoom} onChange={onChangeZoomView} />
                <MapInfo
                    point={mapUtils.getCenter({ marker, circle, polygon, line })}
                    distance={mapUtils.getTotalDistance({ line, polygon })}
                    area={area}
                />
            </GoogleMap>
        </div>
    );
}

export const MapView = memo(withMapProvider(Component));
