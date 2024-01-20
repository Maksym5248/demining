import { memo, useRef, useState } from "react";

import { Divider, Input, Spin, Typography } from "antd";
import { OVERLAY_MOUSE_TARGET, GoogleMap, useLoadScript, Libraries, GoogleMapProps, DrawingManager, Autocomplete, Marker, Circle, Polyline, OverlayViewF } from '@react-google-maps/api';

import { CONFIG } from "~/config";
import { Icon } from "~/components";
import { useCurrentLocation } from "~/hooks";

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

function adjustLatLngByPixelOffset(
	latLng: google.maps.LatLng | undefined | null,
	xOffset:number,
	yOffset:number,
	map:google.maps.Map | undefined,
	zoom:number
):google.maps.LatLng | null {
	if(!map || !latLng){
		return null;
	}

	const scale = 2**(zoom ?? 1);
	const projection = map.getProjection() as google.maps.Projection;
	const point = projection?.fromLatLngToPoint(latLng) as google.maps.Point;

	point.x += xOffset / scale;
	point.y += yOffset / scale;

	return projection.fromPointToLatLng(point);
};

function Component(props: GoogleMapProps) {
	const mapOptions = {
		streetViewControl: false,
		scaleControl: true,
		fullscreenControl: false,
		mapTypeId: "satellite",
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: window?.google?.maps?.MapTypeControlStyle?.DROPDOWN_MENU,
		},
	}
	
	const circleOptions = {
		fillOpacity: 0.3,
		fillColor: '#ff0000',
		strokeColor: '#ff0000',
		strokeWeight: 2,
		draggable: true,
		editable: true
	}

	const polylineOptions = {
		fillOpacity: 0.3,
		fillColor: '#fff',
		strokeColor: '#fff',
		strokeWeight: 2,
	}

	const markerOptions = {};
	
	const drawingManagerOptions  = {
		circleOptions,
		markerOptions,
		drawingControl: true,
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

	const [marker, setMarker] = useState<google.maps.LatLng>();
	const [circle, setCircle] = useState<{ center: google.maps.LatLng, radius: number}>();
	const [zoom, setZoom] = useState<number>(15);

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
		}

		if (event.type === window?.google?.maps?.drawing?.OverlayType.CIRCLE) {
			const circleCenter = (event.overlay as google.maps.Circle)?.getCenter() as google.maps.LatLng;
			const circleRadius = (event.overlay as google.maps.Circle)?.getRadius();
			event.overlay?.setMap(null);
			setCircle({
				center: circleCenter,
				radius: circleRadius
			});
		}
	}

	const onZoomChanged = () => {
		if(!mapRef?.current){
			return
		}
		
		setZoom(mapRef.current.getZoom() as number);
	};

	const onClickMarker = () => {
		setMarker(undefined)
	};

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded || position.isLoading) {
		return <Spin/>;
	}

	const callout = adjustLatLngByPixelOffset(marker, 150, -150, mapRef.current, zoom);
	
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
				{...props}
			>
				<DrawingManager
				// @ts-ignore
					onLoad={onLoadDrawingManager}
					onOverlayComplete={onOverlayComplete}
					options={drawingManagerOptions}
				/>
				{!!circle && <Circle options={circleOptions} {...(circle ?? {})} /> }
				{!!marker && <Marker position={marker} clickable onClick={onClickMarker}/>}
				{!!marker && !!callout && (
					<OverlayViewF
						position={callout}
						mapPaneName={OVERLAY_MOUSE_TARGET}
					>
						<div css={s.callout}>
							<div css={s.calloutHeader} >
								<Typography.Text css={s.calloutText}>AC-76 2од.</Typography.Text>
								<Typography.Text css={s.calloutText}>AC-125 113од.</Typography.Text>
							</div>
							<Divider css={s.calloutDivider} />
							<Typography.Text css={s.calloutText}>25.09.23</Typography.Text>
						</div>
					</OverlayViewF>
				)}
				{!!marker && !!callout && (
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
			</GoogleMap>
		</div>
	);
}

export const MapView = memo(Component)