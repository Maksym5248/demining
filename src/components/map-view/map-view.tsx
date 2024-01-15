import { memo } from "react";

import { GoogleMap, useLoadScript, Marker, Libraries, GoogleMapProps, DrawingManager } from '@react-google-maps/api';

import { CONFIG } from "~/config";

const libraries:Libraries = ["places", "drawing"];

const mapContainerStyle = {
	width: '100vw',
	height: '100vh',
};

const center = {
	lat: 50.30921013386864, 
	lng: 30.56128765735266,
};

// 1 - initial location
// 2 - drawing
// 3 - create image based on map  

const mapOptions = {
	streetViewControl: false,
	scaleControl: true,
	mapTypeControlOptions: {
		style: 1.0,
	},
}

const drawingManagerOptions  = {
	drawingControl: true,
	drawingControlOptions: {
	  position: 2,
	  drawingModes: [
		 "marker",
		 "circle",
		 "polygon",
		 "rectangle",
	  ]
	},
	rectangleOptions: {
	  strokeColor: 'red',
	  strokeWeight: 5,
	  editable: true,
	  zIndex: 1,  
	}
}
function Component(props: GoogleMapProps) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: CONFIG.GOOGLE_MAPS_API_KEY,
		libraries,
	});

	if (loadError) {
		return <div>Error loading maps</div>;
	}

	if (!isLoaded) {
		return <div>Loading maps</div>;
	}

	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			zoom={15}
			center={center}
			options={mapOptions}
			{...props}
		>
			<DrawingManager
				// @ts-ignore
				options={drawingManagerOptions}
			 />
			<Marker position={center} />
		</GoogleMap>
	);
}

export const MapView = memo(Component)