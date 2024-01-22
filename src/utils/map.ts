import { ICircle, ILatLng } from "~/types";

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

function getLatLng(latLang: google.maps.LatLng):ILatLng {
	return {
		lat: latLang.lat(),
		lng: latLang.lng(),
	}
};

function getMapCircle(circle: ICircle) {
	return {
		center: new window.google.maps.LatLng(circle.center),
		radius: circle.radius
	}
};

function getCircle(circle: { center: google.maps.LatLng, radius: number }):ICircle {
	return {
		center: getLatLng(circle.center),
		radius: circle.radius
	}
};

function getMapLatLng(latLang: ILatLng) {
	return new window.google.maps.LatLng(latLang)
};

export const mapUtils = {
	getLatLng,
	getMapLatLng,
	getCircle,
	getMapCircle,
	adjustLatLngByPixelOffset
}