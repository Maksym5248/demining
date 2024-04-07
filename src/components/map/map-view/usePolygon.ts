import { useCallback, useRef } from "react";

import { mapUtils} from "~/utils";
import { ICircle, IPolygon } from "~/types/map";

import { DrawingType } from "../map.types";

interface IUsePolygonParams {
    isCreating: boolean;
    setCreating: (value: boolean) => void;
    drawing:DrawingType,
    polygon?: IPolygon;
    setPolygon: (value?: IPolygon | undefined) => void;
	setCircle: (value?: ICircle) => void;
    onChange?: (value: { polygon?: IPolygon }) => void;
}

export function usePolygon({
	isCreating,
	setCreating,
	drawing,
	polygon,
	setPolygon,
	setCircle,
	onChange,
}: IUsePolygonParams) {
	const polygonRef = useRef<google.maps.Polygon>();

	const onLoadPolygon = (newPolygonRef: google.maps.Polygon) => {
		polygonRef.current = newPolygonRef;
	}

	const onDragPolygonEnd = useCallback(() => {
		if(!polygonRef.current) return;

		const points = polygonRef.current?.getPath();

		if(!points.getLength()) return;

		const v = points.getArray().map((point) => mapUtils.createPointLiteral(point));
		const value = { points: v };
		setPolygon(value);
		onChange?.({ polygon: value })
	}, []);

	const clear = () => {
		setPolygon(undefined);
	}

	const onClickMap = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

		if(drawing === DrawingType.POLYGON && !isCreating && !polygon?.points.length){
			setCreating(true);
			setCircle(undefined);
			setPolygon({ points: [point] });
		}
		
		if(drawing === DrawingType.POLYGON && isCreating && !!polygon?.points.length ){
			setPolygon(({ points: [...polygon.points, point] }));
		}
	}

	const onPathChanged = useCallback(() => {
		if (!polygonRef.current) return;
	  
		const path = polygonRef.current.getPath();
		const points = path.getArray().map((point) => mapUtils.createPointLiteral(point));
		const value = { points };
	  
		setPolygon(value);
		onChange?.({ polygon: value });
	  }, []);
	  
	const onClickPolyline = (e: google.maps.PolyMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
		const first = polygon?.points[0]

		if(drawing === DrawingType.POLYGON && isCreating && !!polygon?.points.length && first?.lat === point.lat && first?.lng === point.lng){
			setCreating(false);
			onChange?.({ polygon })
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