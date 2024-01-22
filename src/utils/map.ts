import { ICircle, ILatLng } from "~/types";

const getLatLngLiteral = (latLng: google.maps.LatLng) => ({
	lng: latLng?.lng(),
	lat: latLng?.lat(),
})

const getComputedOffset = (latLng: google.maps.LatLngLiteral  | undefined, distance:number | undefined, bearing:number) => {
	if(!latLng || !distance){
		return null;
	}

	const value = window?.google.maps.geometry.spherical.computeOffset(latLng, distance, bearing);
	
	if(!value){
		return null
	}

	return getLatLngLiteral(value)
}

function adjustLatLngByPixelOffset(
	latLng: google.maps.LatLngLiteral | undefined | null,
	xOffset:number,
	yOffset:number,
	map:google.maps.Map | undefined,
	zoom:number
):google.maps.LatLngLiteral | null {
	if(!map || !latLng){
		return null;
	}

	const scale = 2**(zoom ?? 1);
	const projection = map.getProjection();

	if(!projection){
		return null
	}

	const point = projection?.fromLatLngToPoint(latLng);

	if(!point){
		return null
	}

	point.x += xOffset / scale;
	point.y += yOffset / scale;

	const value = projection.fromPointToLatLng(point);

	if(!value){
		return null
	}

	return getLatLngLiteral(value)

};

function getLatLng(latLang: google.maps.LatLngLiteral):ILatLng {
	return {
		lat: latLang.lat,
		lng: latLang.lng,
	}
};

function getMapCircle(circle: ICircle) {
	return {
		center: circle.center,
		radius: circle.radius
	}
};

function getCircle(circle: { center: google.maps.LatLngLiteral, radius: number }):ICircle {
	return {
		center: getLatLng(circle.center),
		radius: circle.radius
	}
};

function getMapLatLng(latLang: ILatLng) {
	return latLang
};

export const mapUtils = {
	getLatLngLiteral,
	getLatLng,
	getMapLatLng,
	getCircle,
	getMapCircle,
	adjustLatLngByPixelOffset,
	getComputedOffset,
}