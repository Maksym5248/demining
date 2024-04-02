import { ICircle, IPolygon, IPoint } from "~/types";

interface IMapViewItem {
    circle?: ICircle;
	marker?: IPoint;
	polygon?: IPolygon;
	zoom?: number;
}
export interface MapEditorModalProps {
    initialCircle?: ICircle;
	initialMarker?: IPoint;
	initialPolygon?: IPolygon;
	initialZoom?: number;
    isVisible: boolean;
    hide: () => void;
    onSubmit: (value: IMapViewItem) => void;
}