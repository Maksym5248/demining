import { memo, useMemo, useRef, useState } from "react";

import { Divider, Input, Spin, Typography } from "antd";
import { OVERLAY_MOUSE_TARGET, GoogleMap, useLoadScript, Libraries, GoogleMapProps, DrawingManager, Autocomplete, Marker, Circle, Polyline, OverlayViewF } from '@react-google-maps/api';
import { Dayjs } from "dayjs";

import { CONFIG } from "~/config";
import { Icon } from "~/components";
import { useCurrentLocation } from "~/hooks";
import { mapUtils} from "~/utils";
import { ICircle, ILatLng } from "~/types/map";
import { MAP_ZOOM } from "~/constants";

import { s } from "./map-view.style";

const libraries:Libraries = ["places", "drawing", "geometry"];

// 1 + initial location based on api address in ukraine
// 2 + callout for marker, to show 
// 3 - show m2 in circle
// 4 - clear items on map
// 5 - вирівняти DrawingManager
  
const defaultCenter = {
	lat: 50.30921013386864, 
	lng: 30.56128765735266,
}

interface IMapViewProps extends Pick<GoogleMapProps, "children" | "mapContainerStyle"> {
	initialMarker?: ILatLng | undefined;
	initialCircle?: ICircle | undefined;
	initialZoom?: number;
	onChange: (value: {
		marker?: ILatLng,
		circle?: ICircle,
		zoom: number,
	}) => void;
	type?: "picture" | "edit";
	date?: Dayjs;
	explosiveObjects?: string[];
}

type IMarkerState = google.maps.LatLng | undefined;
type ICircleState = { center: google.maps.LatLng, radius: number } | undefined;

function Component({
	initialMarker,
	initialCircle,
	initialZoom,
	onChange,
	type = "edit",
	date,
	explosiveObjects,
	...rest
}: IMapViewProps) {
	const isPictureType = type === "picture";

	const mapOptions = {
		streetViewControl: false,
		scaleControl: !isPictureType,
		zoomControl: !isPictureType,
		fullscreenControl: false,
		mapTypeId: "satellite",
		mapTypeControl: !isPictureType,
		disableDoubleClickZoom: !isPictureType,
		draggable: !isPictureType,
		isFractionalZoomEnabled: !isPictureType,
		mapTypeControlOptions: {
			style: window?.google?.maps?.MapTypeControlStyle?.DROPDOWN_MENU,
		},
	}
	
	const circleOptions = {
		fillOpacity: 0.3,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: !isPictureType,
		editable: !isPictureType
	}

	const polylineOptions = {
		fillOpacity: 0.3,
		fillColor: '#fff',
		strokeColor: '#fff',
		strokeWeight: 2,
	}

	const markerOptions = {
		draggable: !isPictureType,
		editable: !isPictureType
	};
	
	const drawingManagerOptions  = {
		circleOptions,
		markerOptions,
		drawingControl: !isPictureType,
		drawingControlOptions: {
			position: window.google?.maps?.ControlPosition?.TOP_LEFT,
			drawingModes: [
				window.google?.maps?.drawing?.OverlayType?.CIRCLE,
				window.google?.maps?.drawing?.OverlayType?.MARKER,
			]
		}
	}

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: CONFIG.GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const position = useCurrentLocation(defaultCenter);

	const mapRef = useRef<google.maps.Map>();
	const autocompleteRef = useRef<google.maps.places.Autocomplete>();
	const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();

	const [marker, setMarker] = useState<IMarkerState>(initialMarker ? mapUtils.getMapLatLng(initialMarker): undefined);
	const [circle, setCircle] = useState<ICircleState>(initialCircle ? mapUtils.getMapCircle(initialCircle): undefined);
	const [zoom, setZoom] = useState<number>(initialZoom ?? MAP_ZOOM.DEFAULT);

	const onLoadMap = (map:google.maps.Map) => {
		mapRef.current = map;
	}

	const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
		autocompleteRef.current = autocomplete;
	}

	const onPlaceChanged = () => {
		const { geometry } = autocompleteRef?.current?.getPlace() ?? {};
		const bounds = new window.google.maps.LatLngBounds();

		if (geometry?.viewport) {
			bounds.union(geometry.viewport);
		} else if(geometry?.location){
			bounds.extend(geometry?.location);
		}

		if(geometry?.location){
			setMarker(geometry.location);
		}

		mapRef?.current?.fitBounds(bounds);
	}

	const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
		drawingManagerRef.current = drawingManager;
	}

	const onOverlayComplete = (event: google.maps.drawing.OverlayCompleteEvent) => {
		if (event.type === window?.google?.maps?.drawing?.OverlayType.MARKER) {
			const newMarker = (event.overlay as google.maps.Marker)?.getPosition() as  google.maps.LatLng;
			event.overlay?.setMap(null);
			setMarker(newMarker);
			mapRef?.current?.setCenter(newMarker);
			onChange?.({
				marker: mapUtils.getLatLng(newMarker),
				circle: circle ? mapUtils.getCircle(circle) : undefined,
				zoom 
			})
		}

		if (event.type === window?.google?.maps?.drawing?.OverlayType.CIRCLE) {
			const circleCenter = (event.overlay as google.maps.Circle)?.getCenter() as google.maps.LatLng;
			const circleRadius = (event.overlay as google.maps.Circle)?.getRadius();
			event.overlay?.setMap(null);
			const newValue = { center: circleCenter, radius: circleRadius }
			setCircle(newValue);
			onChange?.({
				marker: marker ? mapUtils.getLatLng(marker) : undefined,
				circle: mapUtils.getCircle(newValue),
				zoom 
			})
		}
	}

	const onZoomChanged = () => {
		if(!mapRef?.current){
			return
		}
		
		const newZoom = mapRef.current.getZoom() as number;
	
		setZoom(mapRef.current.getZoom() as number);
		onChange?.({
			marker: marker ? mapUtils.getLatLng(marker) : undefined,
			circle: circle ? mapUtils.getCircle(circle) : undefined,
			zoom: newZoom
		})
	};

	const onClickMarker = () => {
		setMarker(undefined)
	};

	const callout = useMemo(() =>
		mapUtils.adjustLatLngByPixelOffset(marker, 150, -150, mapRef.current, zoom),
	[marker, mapRef.current, zoom]);

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded || position.isLoading) {
		return <Spin/>;
	}

	const isVisibleCircle = !!circle;
	const isVisibleMarker = !!marker;
	const isVisibleCallout = isVisibleMarker && !!callout && explosiveObjects?.length && date;

	return (
		<div css={s.container}>
			<div css={s.drawingPanel}>
				{drawingManagerRef.current && (
					<Icon.DeleteOutlined 
						css={s.deleteIcon} 
					/>
				)}
			</div>
			<GoogleMap
				mapContainerStyle={s.mapContainerStyle}
				zoom={zoom}
				center={position.coords}
				options={mapOptions}
				onZoomChanged={onZoomChanged}
				onLoad={onLoadMap}
				{...rest}
			>
				<DrawingManager
				// @ts-ignore
					onLoad={onLoadDrawingManager}
					onOverlayComplete={onOverlayComplete}
					options={drawingManagerOptions}
				/>
				{isVisibleCircle && <Circle options={circleOptions} {...(circle ?? {})} /> }
				{isVisibleMarker && <Marker position={marker} clickable onClick={onClickMarker}/>}
				{isVisibleCallout && (
					<OverlayViewF
						position={callout}
						mapPaneName={OVERLAY_MOUSE_TARGET}
					>
						<div css={s.callout}>
							<div css={s.calloutHeader} >
								{explosiveObjects.map((el, i) => (
									<Typography.Text key={i}  css={s.calloutText}>
										{el}
									</Typography.Text>
								))}
							</div>
							<Divider css={s.calloutDivider} />
							<Typography.Text css={s.calloutText}>{date?.format('DD.MM.YYYY')}</Typography.Text>
						</div>
					</OverlayViewF>
				)}
				{isVisibleCallout && (
					<Polyline
						options={polylineOptions}
						path={[{
							lat: marker.lat(),
							lng: marker.lng(),
						}, {
							lat: callout.lat(),
							lng: callout.lng(),
						}]}
					/>
				)}
				{!isPictureType && (
					<Autocomplete
						onLoad={onLoadAutocomplete}
						onPlaceChanged={onPlaceChanged}
					>
						<Input
							type='text'
							placeholder='Адреса'
							css={s.autocomplete}
						/>
					</Autocomplete>
				)}
			</GoogleMap>
		</div>
	);
}

export const MapView = memo(Component)