import { ICircle, IPoint, IPolygon } from "~/types";

const getPointLiteral = (latLng: google.maps.LatLng) => ({
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

	return getPointLiteral(value)
}

function adjustPointByPixelOffset(
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

	return getPointLiteral(value)

};


function getMapCircle(circle: ICircle) {
	return {
		center: circle.center,
		radius: circle.radius
	}
};

function getMapPolygon(polygon: IPolygon) {
	return {
		points: polygon.points,
	}
};

function getPoint(latLang: google.maps.LatLngLiteral):IPoint {
	return {
		lat: latLang.lat,
		lng: latLang.lng,
	}
};


function getCircle(circle: { center: google.maps.LatLngLiteral, radius: number }):ICircle {
	return {
		center: getPoint(circle.center),
		radius: circle.radius
	}
};

function getPolygon(polygon: { points: google.maps.LatLngLiteral[] }):IPolygon {
	return {
		points: polygon?.points?.map(getPoint),
	}
};

function getMapPoint(latLang: IPoint) {
	return latLang
};

export const mapUtils = {
	getPointLiteral,
	getPoint,
	getMapPoint,
	getCircle,
	getPolygon,
	getMapCircle,
	getMapPolygon,
	adjustPointByPixelOffset,
	getComputedOffset,
}