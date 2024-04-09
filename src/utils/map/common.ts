import { ICircle, IPoint, IPolygon, IGeoBox } from "~/types";

import { mathUtils } from "../math";

/**
 * @returns m2
 */
function getDistanceByPoints(point1: IPoint, point2: IPoint): number {
	const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
  
	return distance;
}

function getRadiusByZoom(center: IPoint, zoom:number ): number {
	return 156543.03392 * Math.cos(center.lat * Math.PI / 180) / 2**zoom;
}

/**
 * 
 * @param param2 { radius: m2 }
 */
function getGeoBoxByZoomOrRadius(center: IPoint, { zoom, radius }: ( { zoom?: number, radius?: number}) ): IGeoBox {
	// distance in meters
	const distance = radius ?? getRadiusByZoom(center, zoom as number);

	const topLeft = google.maps.geometry.spherical.computeOffset(center, distance, 315);
	const bottomRight = google.maps.geometry.spherical.computeOffset(center, distance, 135);

	return {
		topLeft: { lat: topLeft.lat(), lng: topLeft.lng() },
		bottomRight: { lat: bottomRight.lat(), lng: bottomRight.lng() },
	};
}

function getGeoBox(map: google.maps.Map): IGeoBox | null {
	const bounds = map.getBounds();
  
	if (!bounds) {
	  return null;
	}
  
	const ne = bounds.getNorthEast();
	const sw = bounds.getSouthWest();
  
	const geoBox: IGeoBox = {
	  topLeft: { lat: ne.lat(), lng: sw.lng() },
	  bottomRight: { lat: sw.lat(), lng: ne.lng() },
	};
  
	return geoBox;
}
  
function getAreaCircle(radius: number): number {
	return Math.PI * radius**2;
}

function getAreaPolygon(polygon: IPoint[]): number {
	const path = polygon.map(point => new google.maps.LatLng(point.lat, point.lng));
  
	return google.maps.geometry.spherical.computeArea(path);
}

const getArea = (circle?:ICircle, polygon?: IPolygon) => {
	if(circle){
		return mathUtils.toFixed(getAreaCircle(circle.radius), 0);
	}

	if(polygon){
		return mathUtils.toFixed(getAreaPolygon(polygon.points), 0);
	}

	return undefined;
}

function haversineDistance(point1: { lat: number, lng: number }, point2: { lat: number, lng: number }): number {
	const R = 6371e3; // Radius of the Earth in meters
	const lat1Rad = point1.lat * Math.PI/180;
	const lat2Rad = point2.lat * Math.PI/180;
	const deltaLat = (point2.lat - point1.lat) * Math.PI/180;
	const deltaLng = (point2.lng - point1.lng) * Math.PI/180;
  
	const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
			  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
			  Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
	return R * c;
}

function getCenterPolygon(data: IPolygon): IPoint | undefined {
	// If the data is a polygon, calculate the centroid of the polygon
	const {points} = (data as IPolygon);
	const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
	const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;  
	return { lat, lng }
}

function getCenterAndRadiusByGeoBox(geoBox: IGeoBox): ICircle {
	// Calculate the center
	const center = {
	  lat: (geoBox.topLeft.lat + geoBox.bottomRight.lat) / 2,
	  lng: (geoBox.topLeft.lng + geoBox.bottomRight.lng) / 2
	};
  
	// Calculate the radius using the Haversine formula
	const radius = haversineDistance(center, geoBox.topLeft);
  
	return { center, radius };
}


function getInfoPoint({ marker, circle, polygon }: {marker?: IPoint, circle?: ICircle, polygon?: IPolygon}): IPoint | undefined {
	if(marker){
		return marker
	} 

	if(circle){
		return circle.center
	}

	if(polygon){
		return getCenterPolygon(polygon)
	}

	return undefined
}

export {
	getDistanceByPoints,
	getInfoPoint,
	getCenterAndRadiusByGeoBox,
	getGeoBoxByZoomOrRadius,
	getGeoBox,
	getArea,
}