import { ICircle, IPolygon, IPoint } from "~/types";

export interface IMapEditorSubmit {
    circle?: ICircle;
	marker?: IPoint;
	polygon?: IPolygon;
	zoom?: number;
	area?: number;
}
export interface MapEditorModalProps {
    initialCircle?: ICircle;
	initialMarker?: IPoint;
	initialPolygon?: IPolygon;
	initialZoom?: number;
	initialArea?: number;
    isVisible: boolean;
    hide: () => void;
    onSubmit: (value: IMapEditorSubmit) => void;
}