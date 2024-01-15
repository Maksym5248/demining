import { MapView } from "~/components"

const mapContainerStyle = {
	width: '640px',
	height: '600px',
};

export function Map(){

	return <MapView mapContainerStyle={mapContainerStyle}/>
}