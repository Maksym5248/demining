import { type Interpolation, type Theme } from '@emotion/react';
import { type GoogleMapProps } from '@react-google-maps/api';
import { type DrawingType, type ICircle, type IGeoBox, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

import { type IUseCircleReturn } from './useCircle';
import { type IUseLineReturn } from './useLine';
import { type IUsePolygonReturn } from './usePolygon';
import { type IMapItem } from '../map-item';

export interface IOnChangeMapView {
    line?: ILine;
    polygon?: IPolygon;
    marker?: IPoint;
    circle?: ICircle;
    zoom: number;
    area?: number; // m2
}

export interface IMapDrawingProps {
    marker: IPoint | undefined;
    circle: ICircle | undefined;
    line: ILine | undefined;
    polygon: IPolygon | undefined;
    drawing: DrawingType;
    isCreating: boolean;
    circleManager: IUseCircleReturn;
    lineManager: IUseLineReturn;
    polygonManager: IUsePolygonReturn;
}

export interface IMapFiguresProps<T extends IMapItem> {
    isVisibleInArea: boolean;
    items?: T[];
    renderMapItem?: (item: T) => React.ReactNode | undefined;
}

export interface IMapViewProps<T extends IMapItem> extends Pick<GoogleMapProps, 'children' | 'mapContainerStyle'> {
    initialMarker?: IPoint;
    initialCircle?: ICircle;
    initialLine?: ILine;
    initialPolygon?: IPolygon;
    initialZoom?: number;
    position?: IPoint;
    items?: T[];
    isLoadingVisibleInArea?: boolean;
    minZoomLoadArea?: number;
    initialIsActiveStick?: boolean;
    initialIsVisibleInArea?: boolean;
    onChange: (value: IOnChangeMapView) => void;
    onChangeGeobox?: (value: { box: IGeoBox; zoom: number }) => void;
    onChangeEditing?: (value: boolean) => void;
    renderMapItem?: (item: T) => React.ReactNode | undefined;
    isVisibleDrawing?: boolean;
    selectedItem?: T;
    css?: Interpolation<Theme>;
}
