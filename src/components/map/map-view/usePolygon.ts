import { MutableRefObject, useCallback, useRef } from "react";

import { mapUtils} from "~/utils";
import { ICircle, IPoint, IPolygon } from "~/types/map";

import { DrawingType } from "../map.types";

interface IUsePolygonParams {
    isCreating: boolean;
    setCreating: (value: boolean) => void;
    drawing:DrawingType,
    polygon?: IPolygon;
    setPolygon: (value?: IPolygon | undefined) => void;
	setCircle: (value?: ICircle) => void;
	polygons?: IPolygon[];
	circles?: ICircle[];
	isActiveStick: boolean;
	mapRef?: MutableRefObject<google.maps.Map | undefined>;
}

export function usePolygon({
	isCreating,
	setCreating,
	drawing,
	polygon,
	setPolygon,
	setCircle,
	polygons,
	circles,
	isActiveStick,
	mapRef,
}: IUsePolygonParams) {
	const polygonRef = useRef<google.maps.Polygon>();

	const onLoadPolygon = (newPolygonRef: google.maps.Polygon) => {
		polygonRef.current = newPolygonRef;
	}

	const getPoint = (point: IPoint) => {
		if(!isActiveStick || !mapRef?.current || (!polygons?.length && !circles?.length)) {
			return point;
		};
		
		const closestPoint = mapUtils.getClosestPoint(point, polygons, circles);
		const pixelDistance = mapUtils.getDistanceByPointsInPixels(point, closestPoint, mapRef.current) ?? Infinity;

		return pixelDistance < 10 && closestPoint ? closestPoint : point;
	}

	const appendPoint = (value: IPoint) => {
		const point = getPoint(value)

		if(polygon?.points.length){
			setPolygon({ points: [...polygon.points, point] });
		} else {
			setPolygon(({ points: [point] }));
		}
	}

	const onDragPolygonEnd = useCallback(() => {
		if(!polygonRef.current) return;

		const points = polygonRef.current?.getPath();

		if(!points.getLength()) return;

		const value = points.getArray().map((point) => mapUtils.createPointLiteral(point));
		setPolygon({ points: value.map(getPoint)});
	}, []);

	const clear = () => {
		setPolygon(undefined);
	}

	const onClickMap = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng || drawing !== DrawingType.POLYGON) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

		if(!isCreating && !polygon?.points.length){
			setCreating(true);
			setCircle(undefined);
		}
		
		appendPoint(point);
	}

	const onPathChanged = useCallback(() => {
		if (!polygonRef.current) return;
	  
		const path = polygonRef.current.getPath();
		const points = path.getArray().map((point) => mapUtils.createPointLiteral(point));	  
		setPolygon({ points: points.map(getPoint)});
	  }, []);
	  
	const onClickPolyline = (e: google.maps.PolyMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
		const first = polygon?.points[0]

		if(drawing === DrawingType.POLYGON && isCreating && !!polygon?.points.length && first?.lat === point.lat && first?.lng === point.lng){
			setCreating(false);
		}
	}

	const isVisiblePolygon = !!polygon?.points.length && !isCreating;
	const isVisiblePolyline = polygon?.points.length && isCreating && drawing === DrawingType.POLYGON;

	return {
		isVisiblePolygon,
		isVisiblePolyline,
		onClickPolyline,
		onDragPolygonEnd,
		onLoadPolygon,
		onClickMap,
		clear,
		value: polygon,
		onPathChanged
	};
}