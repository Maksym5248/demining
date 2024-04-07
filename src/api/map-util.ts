import { geohashForLocation, boundingBoxCoordinates, geohashQueryBounds, GeohashRange } from 'geofire-common';

import { ICircleDB, IGeoBoxDB, IGeoDB, IGeoPointDB, IMapViewActionDB, IPointDB, IPolygonDB } from '~/db';
import { IGeoBox, IPoint } from '~/types';

function getGeoPoint(point: IPointDB): IGeoPointDB {
	const hash = geohashForLocation([point.lat, point.lng]);

	return {
		...point,
		hash
	};
}

function getGeoBox(topLeft: IPointDB, bottomRight: IPointDB): IGeoBoxDB {
	return {
		topLeft: getGeoPoint(topLeft),
		bottomRight: getGeoPoint(bottomRight)
	};
}

function getBoundingBoxFromPolygon(polygon: IPolygonDB): IGeoBoxDB {
	const { points } = polygon;
  
	let minLat = Infinity;
	let maxLat = -Infinity;
	let minLng = Infinity;
	let maxLng = -Infinity;
  
	points.forEach((point) => {
	  minLat = Math.min(minLat, point.lat);
	  maxLat = Math.max(maxLat, point.lat);
	  minLng = Math.min(minLng, point.lng);
	  maxLng = Math.max(maxLng, point.lng);
	});
  
	return getGeoBox(
		{ lat: maxLat, lng: minLng },
		{ lat: minLat, lng: maxLng }
	)
}

function getBoundingBoxFromCircle(circle: ICircleDB): IGeoBoxDB {
	const { center, radius } = circle;
  
	const boundingBox = boundingBoxCoordinates([center.lat, center.lng], radius);

	return getGeoBox(
		{ lat: boundingBox[0][0], lng: boundingBox[0][1] },
		{ lat: boundingBox[1][0], lng: boundingBox[1][1] }
	)
}

function getBoundingBox(data: ICircleDB | IPolygonDB): IGeoBoxDB {
	if ('center' in data && 'radius' in data) {
	  return getBoundingBoxFromCircle(data as ICircleDB);
	}
  
	return getBoundingBoxFromPolygon(data as IPolygonDB);
}

function getCenter(data: ICircleDB | IPolygonDB | IPointDB): IPoint {
	let center: IPointDB;
  
	if ('center' in data) {
	  // If the data is a circle, use the center of the circle
	  center = (data as ICircleDB).center;
	} else if ('points' in data) {
	  // If the data is a polygon, calculate the centroid of the polygon
	  const {points} = (data as IPolygonDB);
	  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
	  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
	  center = { lat, lng };
	} else {
	  // If the data is a point, use the point itself
	  center = data as IPointDB;
	}
  
	return center
}

function getGeo(mapViewAction: Pick<IMapViewActionDB, "circle" | "polygon" | "marker">): IGeoDB | null {
	const { marker, circle, polygon } = mapViewAction;
  
	if (polygon) {
		const center = getCenter(polygon);
		const box = getBoundingBox(polygon);

		return {
			center: getGeoPoint(center),
			box
		};
	}

	if (circle) {
		const center = getCenter(circle);
		const box = getBoundingBox(circle);

		return {
			center: getGeoPoint(center),
			box
		};
	}

	if (marker) {
		const center = getCenter(marker as IPointDB);

		return {
			center: getGeoPoint(center),
			box: null,
		};
	}

	return null
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

function getCenterAndRadiusByGeoBox(geoBox: IGeoBox): ICircleDB {
	// Calculate the center
	const center = {
	  lat: (geoBox.topLeft.lat + geoBox.bottomRight.lat) / 2,
	  lng: (geoBox.topLeft.lng + geoBox.bottomRight.lng) / 2
	};
  
	// Calculate the radius using the Haversine formula
	const radius = haversineDistance(center, geoBox.topLeft);
  
	return { center, radius };
}
  

function getBoundsByGeoBox(geoBox: IGeoBox): GeohashRange[] {
	const { radius, center } = getCenterAndRadiusByGeoBox(geoBox);
	return geohashQueryBounds([center.lat, center.lng], radius);
}

export const mapDBUtils = {
	getGeoBox,
	getGeoPoint,
	getGeo,
	getCenterAndRadiusByGeoBox,
	getBoundsByGeoBox
}