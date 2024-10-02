import { type ICircle, type IPolygon, type IPoint, type ILine } from 'shared-my-client';

export interface IMapEditorSubmit {
    circle?: ICircle;
    marker?: IPoint;
    polygon?: IPolygon;
    line?: ILine;
    zoom?: number;
    area?: number;
}
export interface MapEditorModalProps {
    initialCircle?: ICircle;
    initialMarker?: IPoint;
    initialPolygon?: IPolygon;
    initialLine?: ILine;
    initialZoom?: number;
    initialArea?: number;
}
