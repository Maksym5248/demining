import { memo } from "react";

import { GoogleMap, useLoadScript, Marker, Libraries } from '@react-google-maps/api';

import { CONFIG } from "~/config";

const libraries:Libraries = ["places"];
const mapContainerStyle = {
	width: '100vw',
	height: '100vh',
};
const center = {
	lat: 7.2905715, // default latitude
	lng: 80.6337262, // default longitude
};

function Component() {
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
		<div>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={10}
				center={center}
			>
				<Marker position={center} />
			</GoogleMap>
		</div>
	);
}

export const MapView = memo(Component)