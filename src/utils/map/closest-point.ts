import * as turf from '@turf/turf';

import { IPoint, IPolygon, ILine } from "~/types";

import { createArrFromPoint, createPointFromArr } from './fabric';
import { getDistanceByPoints } from './common';

function getClosestPointOnLine(point: IPoint, line: ILine) {
	const turfLine = turf.lineString([[line.start.lng, line.start.lat], [line.end.lng, line.end.lat]]);
	const turfPoint = turf.point([point.lng, point.lat]);

	const snapped = turf.nearestPointOnLine(turfLine, turfPoint);

	return createPointFromArr(snapped.geometry.coordinates);
}

function getClosestDistanceOnLine(point: IPoint, line: ILine) {
	const turfLine = turf.lineString([[line.start.lng, line.start.lat], [line.end.lng, line.end.lat]]);
	const distance = turf.pointToLineDistance(createArrFromPoint(point), turfLine);

	return distance;
}

function getClosestPointOnPolygon(point:IPoint, polygon:IPolygon) {
	let minDistance = Infinity;
	let closestPoint = null;

	for (let i = 0; i < polygon.points.length; i+=1) {
		const line = {
			start: polygon.points[i],
			end: polygon.points[(i + 1) % polygon.points.length]
		};

		const snapped = getClosestPointOnLine(point, line);
		const distance = getClosestDistanceOnLine(point, line);

		if (distance < minDistance) {
			minDistance = distance;
			closestPoint = snapped;
		}
	}

	return closestPoint;
}

function getClosestPointOnLineForPolygons(point: IPoint, polygons: IPolygon[] = []): IPoint {
	let minDistance = Infinity;
	let closestPoint:IPoint = {lat: 0, lng: 0};
  
	polygons.forEach(polygon => {
	  const currentClosestPoint = getClosestPointOnPolygon(point, polygon);

	  if (!currentClosestPoint) return;
	  
	  const distance = turf.distance(
			turf.point(createArrFromPoint(point)),
			turf.point(createArrFromPoint(currentClosestPoint))
	  );
  
	  if (distance < minDistance) {
			minDistance = distance;
			closestPoint = currentClosestPoint;
	  }
	});
  
	return closestPoint as IPoint;
}

function getClosestPointOnPolygonPoint(point: IPoint, polygon: IPolygon): IPoint {
	let minDistance = Infinity;
	let closestPoint: IPoint = { lat: 0, lng: 0 };
  
	polygon.points.forEach(polygonPoint => {
	  const distance = getDistanceByPoints(point, polygonPoint);
  
	  if (distance < minDistance) {
			minDistance = distance;
			closestPoint = polygonPoint;
	  }
	});
  
	return closestPoint;
}

function getClosestPointOnPointForPolygons(point: IPoint, polygons: IPolygon[] = []): IPoint {
	let minDistance = Infinity;
	let closestPoint: IPoint = { lat: 0, lng: 0 };
  
	polygons.forEach(polygon => {
	  const currentClosestPoint = getClosestPointOnPolygonPoint(point, polygon);
	  const distance = getDistanceByPoints(point, currentClosestPoint);
  
	  if (distance < minDistance) {
			minDistance = distance;
			closestPoint = currentClosestPoint;
	  }
	});
  
	return closestPoint;
}


export {
	getClosestPointOnLineForPolygons,
	getClosestPointOnPointForPolygons
}