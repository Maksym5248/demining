import { memo, useCallback, useRef, useState } from "react";

import { Spin } from "antd";
import { GoogleMap, Marker, Circle, Polygon, useLoadScript, Libraries, Polyline } from '@react-google-maps/api';

import { mapUtils} from "~/utils";
import { ICircle, IMarker, IPoint, IPolygon } from "~/types/map";
import { DEFAULT_CENTER, MAP_ZOOM } from "~/constants";
import { useCurrentLocation, useMapOptions } from "~/hooks";
import { CONFIG } from "~/config";

import { s } from "./map-view.style";
import { DrawingManager } from "../drawing-manager";
import { MapInfo } from "../map-info";
import { Autocomplete } from "../autocomplete";
import { DrawingType, IMapViewProps } from "../map.types";

const libraries:Libraries = ["places", "drawing", "geometry"];


function Component({
	initialMarker,
	initialCircle,
	initialPolygon,
	initialZoom,
	onChange,
	position,
	...rest
}: IMapViewProps) {
	const isPictureType = false;

	 const [drawing, setDrawing] = useState(DrawingType.MOVE);
	 const [isCreating, setCreating] = useState(false);

	 const {
		mapOptions, polygonOptions, circleOptions, createPolygonOptions
	} = useMapOptions({ isPictureType, isCreating, drawing});

	const mapRef = useRef<google.maps.Map>();
	const circleRef = useRef<google.maps.Circle>();
	const polygonRef = useRef<google.maps.Polygon>();

	const [center, setCenter] = useState<IMarker | undefined>(initialMarker ?? position);
	const [marker, setMarker] = useState<IMarker | undefined>(initialMarker);
	const [circle, setCircle] = useState<ICircle | undefined>(initialCircle);
	const [polygon, setPolygon] = useState<IPolygon | undefined>(initialPolygon);

	const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);
	
	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
	}

	const onLoadCircle = (newCircleRef: google.maps.Circle) => {
		circleRef.current = newCircleRef;
	}

	const onLoadPolygon = (newPolygonRef: google.maps.Polygon) => {
		polygonRef.current = newPolygonRef;
	}

	const _onChange = (value: { polygon?: IPolygon, marker?: IPoint, circle?: ICircle, zoom?: number}) => {
		onChange?.({
			polygon,
			circle,
			marker,
			zoom,
			...value
		})
	}

	const onPlaceChanged = ({ point }: { point: IPoint}) => {	  
		if (!point) {
			return;
		}

		 setMarker(point);
		 setCenter(point);
		 mapRef?.current?.setCenter(point);
		 _onChange?.({ marker: point });
	 
		 const bounds = new window.google.maps.LatLngBounds();
		 bounds.extend(point);
		 mapRef?.current?.fitBounds(bounds);
	}

	const onZoomChanged = () => {
		if(!mapRef?.current){
			return
		}
		
		const newZoom = mapRef.current.getZoom() as number;
	
		setZoom(mapRef.current.getZoom() as number);
		_onChange?.({ zoom: newZoom })
	};

	const onRadiusChanged = useCallback(() => {
		if(circleRef.current){
			const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
			const circleRadius = circleRef.current?.getRadius();

			setCircle({ center: mapUtils.getPointLiteral(circleCenter), radius: circleRadius})
		}
	}, []);
	
	const onDragCircleEnd = useCallback(() => {
		if(!circleRef.current) return;

		const circleCenter = circleRef.current?.getCenter() as google.maps.LatLng;
		const circleRadius = circleRef.current?.getRadius();
		const value = { center: mapUtils.getPointLiteral(circleCenter), radius: circleRadius};

		setCircle(value)
		_onChange?.({ circle: value })
	}, []);

	const onDragPolygonEnd = useCallback(() => {
		if(!polygonRef.current) return;

		const points = polygonRef.current?.getPath();

		if(!points.getLength()) return;

		const v = points.getArray().map((point) => mapUtils.getPointLiteral(point));
		const value = { points: v };
		setPolygon(value);
		_onChange?.({ polygon: value })
	}, []);

	const onClear = () => {
		setMarker(undefined);
		setCircle(undefined);
		setPolygon(undefined);
	}

	const onClickMap = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

		if(drawing === DrawingType.MARKER){
			setMarker(point);
			_onChange?.({ marker: point })
		}

		if(drawing === DrawingType.CIRCLE && isCreating){
			setCreating(false);
			_onChange?.({ circle })
		}

		if(drawing === DrawingType.CIRCLE && !isCreating && !circle){
			setCreating(true);
			setPolygon(undefined);
			setCircle({
				center: { lat: e.latLng.lat(), lng: e.latLng.lng() },
				radius: 0,
			});
		}

		if(drawing === DrawingType.POLYGON && !isCreating && !polygon?.points.length){
			setCreating(true);
			setCircle(undefined);
			setPolygon({ points: [point] });
		}
		
		if(drawing === DrawingType.POLYGON && isCreating && !!polygon?.points.length ){
			setPolygon(prev => ({ points: [...(prev?.points ?? []), point] }));
		}
	}

	const onClickPolyline = (e: google.maps.PolyMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
		const first = polygon?.points[0]

		if(drawing === DrawingType.POLYGON && isCreating && !!polygon?.points.length && first?.lat === point.lat && first?.lng === point.lng){
			setCreating(false);
			_onChange?.({ polygon })
		}
	}

	const onMouseMove = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng || !circle?.center) return;

		if(drawing === DrawingType.CIRCLE  && isCreating){
			const currentPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
			const value ={
				...circle,
				radius: mapUtils.calculateDistance(circle?.center, currentPosition)
			};

			setCircle(value);
		}
	}

	const onChangeDrawing = (value: DrawingType) => {
		setDrawing(value)
	}

	const isVisiblePolygon = !!polygon?.points.length;
	const isVisibleCircle = !!circle?.center && circle?.radius;
	const isVisibleMarker = !!marker;

	return (
		<div css={s.container}>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				zoom={zoom}
				center={center}
				options={{
					...mapOptions,
					draggableCursor: drawing === DrawingType.MOVE ? 'grab' : "crosshair",
				  }}
				onZoomChanged={onZoomChanged}
				onLoad={onLoadMap}
				onClick={onClickMap}
				onMouseMove={onMouseMove}
				{...rest}
			>
				<DrawingManager onChange={onChangeDrawing} value={drawing} onClear={onClear}/>
				{isVisiblePolygon && !isCreating && (
					<Polygon
						onLoad={onLoadPolygon}
					   options={polygonOptions} 
					   {...(circle ?? {})}
					   path={polygon?.points}
					   onDragEnd={onDragPolygonEnd}
					/>
				) }
				{isVisibleCircle && (
					<Circle
					   onLoad={onLoadCircle}
					   options={circleOptions} 
					   {...(circle ?? {})}
					   onRadiusChanged={onRadiusChanged} 
					   onDragEnd={onDragCircleEnd}
					/>
				) }
				{isVisibleMarker && <Marker position={marker} clickable />}
				{polygon?.points.length && isCreating && drawing === DrawingType.POLYGON && (
					<Polyline
						path={polygon.points}
						options={createPolygonOptions}
						onClick={onClickPolyline}
					/>
				)}
				{!isPictureType && (
					<Autocomplete onPlaceChanged={onPlaceChanged} />
				)}
				<MapInfo marker={marker} circle={circle} polygon={polygon}/>
			</GoogleMap>
		</div>
	);
}

function MapLoader(props: IMapViewProps) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: CONFIG.GOOGLE_API_KEY,
		language: "uk",
		libraries,
	});

	const position = useCurrentLocation(DEFAULT_CENTER);

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded || position.isLoading) {
		return <div css={s.containerLoading}><Spin/></div>;
	}

	return  <Component position={position.coords} {...props}/>
}

export const MapView = memo(MapLoader)