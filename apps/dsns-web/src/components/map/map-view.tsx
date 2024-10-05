import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { GoogleMap } from '@react-google-maps/api';
import { DrawingType, mathUtils, useValues } from 'shared-my-client';
import { mapUtils, type ICircle, type ILine, type IMarker, type IPoint, type IPolygon, useVisibleMap } from 'shared-my-client';

import { MAP_ZOOM } from '~/constants';
import { withMapProvider } from '~/hoc';
import { useMapOptions } from '~/hooks';

import { MapDrawing } from './map-drawing';
import { MapItems } from './map-items';
import { s } from './map-view.style';
import { type IMapViewProps } from './map.types';
import { useCircle } from './useCircle';
import { useLine } from './useLine';
import { usePolygon } from './usePolygon';
import { Autocomplete } from '../map-autocomplete';
import { DrawingManager } from '../map-drawing-manager';
import { MapInfo } from '../map-info';
import { type IMapItem, MapItem } from '../map-item';
import { MapZoomView } from '../map-zoom-view';

function defaultRenderMapItem<T extends IMapItem>(item: T) {
    return <MapItem key={item.id} item={item} />;
}

function Component<T extends IMapItem>({
    initialMarker,
    initialCircle,
    initialPolygon,
    initialZoom,
    initialLine,
    onChange,
    position,
    items,
    onChangeGeobox,
    onChangeEditing,
    isLoadingVisibleInArea,
    minZoomLoadArea = 16,
    initialIsActiveStick = false,
    initialIsVisibleInArea = false,
    renderMapItem = defaultRenderMapItem,
    isVisibleDrawing = true,
    selectedItem,
    css,
    ...rest
}: IMapViewProps<T>) {
    const [drawing, setDrawing] = useState(DrawingType.MOVE);
    const [isCreating, setCreating] = useState(false);

    const { mapOptions, toggleMapType } = useMapOptions({ isPictureType: false, isCreating, drawing });

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

    const polygons: IPolygon[] = useMemo(() => items?.map(el => el.data.polygon).filter(el => !!el) ?? [], [items]) as IPolygon[];

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
                          points: line.points.map(el => ({
                              lat: mathUtils.toFixed(el.lat, 9),
                              lng: mathUtils.toFixed(el.lng, 9),
                          })),
                          width: line.width,
                      }
                    : undefined,
            polygon: polygon
                ? {
                      points: polygon.points.map(el => ({
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
        drawing,
        line,
        isActiveStick,
        setCreating,
        setPolygon,
        setCircle,
        setLine,
    });

    const polygonManager = usePolygon({
        isCreating,
        drawing,
        polygon,
        polygons,
        isActiveStick,
        mapRef,
        setCreating,
        setPolygon,
        setCircle,
        setLine,
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
        <div css={[s.container, css]}>
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
                {!!isVisibleDrawing && (
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
                )}

                <MapItems isVisibleInArea={isVisibleInArea} items={items} renderMapItem={renderMapItem} />
                {!!isVisibleDrawing && (
                    <MapDrawing
                        marker={marker}
                        circle={circle}
                        line={line}
                        polygon={polygon}
                        isCreating={isCreating}
                        drawing={drawing}
                        circleManager={circleManager}
                        lineManager={lineManager}
                        polygonManager={polygonManager}
                    />
                )}

                <Autocomplete onPlaceChanged={onPlaceChanged} />
                <MapZoomView zoom={zoom} onChange={onChangeZoomView} />
                <MapInfo
                    point={mapUtils.getCenter(selectedItem?.data ?? { marker, circle, polygon, line })}
                    distance={mapUtils.getTotalDistance(selectedItem?.data ?? { line, polygon })}
                    area={
                        selectedItem?.data
                            ? mapUtils.getArea(selectedItem?.data?.circle, selectedItem?.data?.polygon, selectedItem?.data?.line)
                            : area
                    }
                />
            </GoogleMap>
        </div>
    );
}

export const MapView = memo(withMapProvider(Component)) as <T extends IMapItem>(props: IMapViewProps<T>) => JSX.Element;
