import { type GoogleMapProps } from '@react-google-maps/api';
import { type DrawingType, type ICircle, type IGeoBox, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

import { type IUseCircleReturn } from './useCircle';
import { type IUseLineReturn } from './useLine';
import { type IUsePolygonReturn } from './usePolygon';

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

export interface IMapFiguresProps {
    isVisibleInArea: boolean;
    circles: ICircle[] | undefined;
    polygons: IPolygon[] | undefined;
    lines: ILine[] | undefined;
}

export interface IMapViewProps extends Pick<GoogleMapProps, 'children' | 'mapContainerStyle'> {
    initialMarker?: IPoint;
    initialCircle?: ICircle;
    initialLine?: ILine;
    initialPolygon?: IPolygon;
    initialZoom?: number;
    onChange: (value: IOnChangeMapView) => void;
    position?: IPoint;
    polygons?: IPolygon[];
    lines?: ILine[];
    circles?: ICircle[];
    isLoadingVisibleInArea?: boolean;
    onChangeGeobox?: (value: { box: IGeoBox; zoom: number }) => void;
    onChangeEditing?: (value: boolean) => void;
    minZoomLoadArea?: number;
    initialIsActiveStick?: boolean;
    initialIsVisibleInArea?: boolean;
}
