import { memo, useRef, useState } from "react";

import { Input, Spin } from "antd";
import { GoogleMap, useLoadScript, Libraries, GoogleMapProps, DrawingManager, Autocomplete, Marker, Circle } from '@react-google-maps/api';

import { CONFIG } from "~/config";
import { Icon } from "~/components";

import { s } from "./map-view.style";

const libraries:Libraries = ["places", "drawing"];

// 1 - initial location
// 2 - drawing
// 3 - create image based on map  



const defaultCenter = {
	lat: 50.30921013386864, 
	lng: 30.56128765735266,
}

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
	
	const drawingManagerOptions  = {
		circleOptions,
		markerOptions: {
			title: "text",
		},
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

	const mapRef = useRef<google.maps.Map>();
	const autocompleteRef = useRef<google.maps.places.Autocomplete>();
	const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();

	const [marker, setMarker] = useState<google.maps.LatLng>();
	const [circle, setCircle] = useState<{ center: google.maps.LatLng, radius: number}>();

	const [center] = useState(defaultCenter);

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
		}

		if (event.type === window?.google?.maps?.drawing?.OverlayType.CIRCLE) {
			const circleCenter = (event.overlay as google.maps.Circle)?.getCenter() as  google.maps.LatLng;
			const circleRadius = (event.overlay as google.maps.Circle)?.getRadius();
			event.overlay?.setMap(null);
			setCircle({
				center: circleCenter,
				radius: circleRadius
			});
		}
	}

	const onClickMarker = () => {
		setMarker(undefined)
	};

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded) {
		return <Spin/>;
	}

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
				zoom={15}
				center={center}
				options={mapOptions}
				onLoad={onLoadMap}
				{...props}
			>
				<DrawingManager
				// @ts-ignore
					onLoad={onLoadDrawingManager}
					onOverlayComplete={onOverlayComplete}
					options={drawingManagerOptions}
				/>
				{circle && <Circle options={circleOptions} {...(circle ?? {})}/> }
				{marker && <Marker position={marker} clickable onClick={onClickMarker}/>}
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