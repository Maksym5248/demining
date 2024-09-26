import { type GoogleMapProps } from '@react-google-maps/api';
import { type ICircle, type IGeoBox, type ILine, type IPoint, type IPolygon } from 'shared-my-client';

export interface IOnChangeMapView {
    line?: ILine;
    polygon?: IPolygon;
    marker?: IPoint;
    circle?: ICircle;
    zoom: number;
    area?: number; // m2
}

export enum DrawingType {
    MOVE = 'move',
    MARKER = 'marker',
    CIRCLE = 'circle',
    LINE = 'line',
    POLYGON = 'polygon',
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
    minZoomLoadArea?: number;
}
