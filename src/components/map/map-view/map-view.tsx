import { memo, useRef, useState } from "react";

import { Spin } from "antd";
import { GoogleMap, Marker, Circle, Polygon, useLoadScript, Libraries, Polyline } from '@react-google-maps/api';

import { ICircle, IMarker, IPoint, IPolygon } from "~/types/map";
import { DEFAULT_CENTER, MAP_ZOOM } from "~/constants";
import { useCurrentLocation, useMapOptions } from "~/hooks";
import { CONFIG } from "~/config";
import { mapUtils, mathUtils } from "~/utils";

import { s } from "./map-view.style";
import { DrawingManager } from "../drawing-manager";
import { MapInfo } from "../map-info";
import { Autocomplete } from "../autocomplete";
import { DrawingType, IMapViewProps } from "../map.types";
import { usePolygon } from "./usePolygon";
import { useCircle } from "./useCircle";

const libraries:Libraries = ["places", "drawing", "geometry"];

const getArea = (circle?:ICircle, polygon?: IPolygon) => (circle ||  polygon) ? mathUtils.toFixed(mapUtils.getArea(circle, polygon), 0) : undefined;

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

	const [center, setCenter] = useState<IMarker | undefined>(initialMarker ?? position);
	const [marker, setMarker] = useState<IMarker | undefined>(initialMarker);
	const [circle, setCircle] = useState<ICircle | undefined>(initialCircle);
	const [polygon, setPolygon] = useState<IPolygon | undefined>(initialPolygon);
	const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);

	const _onChange = (value: { polygon?: IPolygon, marker?: IPoint, circle?: ICircle, zoom?: number}) => {
		const newValue = {
			polygon,
			circle,
			marker,
			zoom,
			...value
		};

		onChange?.({
			...newValue,
			area: getArea(newValue.circle, newValue.polygon),
		})
	}

	const polygonManager = usePolygon({
		isCreating,
		setCreating,
		drawing,
		polygon,
		setPolygon,
		setCircle,
		onChange: _onChange
	});

	const circleManager = useCircle({
		isCreating,
		setCreating,
		drawing,
		circle,
		setPolygon,
		setCircle,
		onChange: _onChange
	});
	
	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
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

	const onClear = () => {
		setMarker(undefined);
		circleManager.clear();
		polygonManager.clear();
	}

	const onClickMap = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng) return;

		const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

		if(drawing === DrawingType.MARKER){
			setMarker(point);
			_onChange?.({ marker: point })
		}

		if(drawing === DrawingType.CIRCLE){
			circleManager.onClickMap(e)
		}

		if(drawing === DrawingType.POLYGON){
			polygonManager.onClickMap(e)
		}
	}

	const onMouseMove = (e: google.maps.MapMouseEvent) => {
		if(!e?.latLng || !circle?.center) return;

		if(drawing === DrawingType.CIRCLE){
			circleManager.onMouseMove(e)
		}
	}

	const onChangeDrawing = (value: DrawingType) => {
		setDrawing(value)
	}

	const isVisibleMarker = !!marker;
	const area = getArea(circle, polygon);

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
				<DrawingManager
				  onChange={onChangeDrawing} 
				  value={drawing}
				  onClear={onClear}
				  isDisabledClean={!polygonManager.isVisiblePolygon && !circleManager.isVisibleCircle && !isVisibleMarker}
				  />
				{isVisibleMarker && <Marker position={marker} />}
				{circleManager.isVisibleCircle && (
					<Circle
					   onLoad={circleManager.onLoadCircle}
					   options={circleOptions} 
					   radius={circle?.radius ?? 0}
					   center={circle?.center ?? { lat: 0, lng: 0 }}
					   onRadiusChanged={circleManager.onRadiusChanged} 
					   onDragEnd={circleManager.onDragCircleEnd}
					/>
				)}
				{polygonManager.isVisiblePolygon && (
					<Polygon
					   onLoad={polygonManager.onLoadPolygon}
					   options={polygonOptions} 
					   path={polygon?.points}
					   onDragEnd={polygonManager.onDragPolygonEnd}
					   onMouseUp={polygonManager.onPathChanged}
					/>
				)}
				{polygonManager.isVisiblePolyline && (
					<Polyline
						path={polygon?.points}
						options={createPolygonOptions}
						onClick={polygonManager.onClickPolyline}
					/>
				)}
				{!isPictureType && (
					<Autocomplete onPlaceChanged={onPlaceChanged} />
				)}
				<MapInfo marker={marker} area={area}/>
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