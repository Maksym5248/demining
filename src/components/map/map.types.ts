
import { GoogleMapProps } from '@react-google-maps/api';

import { ICircle, IGeoBox, IPoint, IPolygon } from '~/types';

export interface IOnChangeMapView {
	polygon?: IPolygon,
	marker?: IPoint,
	circle?: ICircle,
	zoom: number,
	area?: number, // m2
}

export enum DrawingType {
	MOVE = 'move',
	MARKER = 'marker',
	CIRCLE = 'circle',
	POLYGON = 'polygon',
}

export interface IMapViewProps extends Pick<GoogleMapProps, "children" | "mapContainerStyle"> {
	initialMarker?: IPoint;
	initialCircle?: ICircle;
	initialPolygon?: IPolygon;
	initialZoom?: number;
	onChange: (value: IOnChangeMapView) => void;
	position?: IPoint;
	polygons?: IPolygon[],
	circles?: ICircle[],
	isLoadingVisibleInArea?: boolean;
	onChangeGeobox?: (value: IGeoBox) => void;
}


