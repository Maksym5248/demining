import { geohashForLocation, boundingBoxCoordinates } from 'geofire-common';

import { ICircleDB, IGeoBoxDB, IGeoDB, IGeoPointDB, IMapViewActionDB, IPointDB, IPolygonDB } from '~/db';
import { IPoint } from '~/types';

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

export const mapDBUtils = {
	getGeoBox,
	getGeoPoint,
	getGeo,
}