import { type ICircle, type IPolygon, type IPoint, type ILine } from 'shared-my-client/map';

export interface IMapEditorSubmit {
    circle?: ICircle;
    marker?: IPoint;
    polygon?: IPolygon;
    line?: ILine;
    zoom?: number;
    area?: number;
}
export interface MapEditorModalProps {
    id?: string;
    initialCircle?: ICircle;
    initialMarker?: IPoint;
    initialPolygon?: IPolygon;
    initialLine?: ILine;
    initialZoom?: number;
    initialArea?: number;
    isVisible: boolean;
    hide: () => void;
    onSubmit: (value: IMapEditorSubmit) => void;
}
