import { type ICircle, type IPoint, type IPolygon, type IGeoBox, type ILine } from '@/shared-client';
import * as turf from '@turf/turf';

import { createArrFromPoint, createPointFromArr } from './fabric';
import { mathUtils } from '../math';

/**
 * @returns m2
 */
function getDistanceByPoints(point1: IPoint, point2: IPoint): number {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);

    return distance;
}

function getRadiusByZoom(center: IPoint, zoom: number): number {
    return (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / 2 ** zoom;
}

/**
 *
 * @param param2 { radius: m2 }
 */
function getGeoBoxByZoomOrRadius(center: IPoint, { zoom, radius }: { zoom?: number; radius?: number }): IGeoBox {
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

function getTotalDistanceLine(line: ILine): number | undefined {
    const { points } = line;
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
        const point1 = points[i];
        const point2 = points[i + 1];
        const distance = getDistanceByPoints(point1, point2);
        totalDistance += distance;
    }

    return mathUtils.toFixed(totalDistance, 0);
}

function getTotalDistancePolygon(polygon: IPolygon): number {
    const { points } = polygon;
    let totalDistance = 0;

    for (let i = 0; i < points.length - 1; i += 1) {
        const point1 = points[i];
        const point2 = points[i + 1];
        const distance = getDistanceByPoints(point1, point2);
        totalDistance += distance;
    }

    // Add distance between the last and first points to close the polygon
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const distance = getDistanceByPoints(lastPoint, firstPoint);
    totalDistance += distance;

    return mathUtils.toFixed(totalDistance, 0);
}

function getTotalDistance({ line, polygon }: { line?: ILine; polygon?: IPolygon }): number | undefined {
    if (line) {
        return getTotalDistanceLine(line);
    }

    if (polygon) {
        return getTotalDistancePolygon(polygon);
    }

    return undefined;
}

function getAreaCircle(radius: number): number {
    return Math.PI * radius ** 2;
}

function getAreaPolygon(polygon: IPolygon): number {
    const path = polygon.points.map((point) => new google.maps.LatLng(point.lat, point.lng));

    return google.maps.geometry.spherical.computeArea(path);
}

function getAreaLine(line: ILine): number {
    const distance = getTotalDistanceLine(line) ?? 1;
    return distance * line.width;
}

const getArea = (circle?: ICircle, polygon?: IPolygon, line?: ILine) => {
    if (circle) {
        return mathUtils.toFixed(getAreaCircle(circle.radius), 0);
    }

    if (polygon) {
        return mathUtils.toFixed(getAreaPolygon(polygon), 0);
    }

    if (line) {
        return mathUtils.toFixed(getAreaLine(line), 0);
    }

    return undefined;
};

function haversineDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1Rad = (point1.lat * Math.PI) / 180;
    const lat2Rad = (point2.lat * Math.PI) / 180;
    const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function getCenterPolygon(data: IPolygon): IPoint | undefined {
    // If the data is a polygon, calculate the centroid of the polygon
    const { points } = data;
    const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
    const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
    return { lat, lng };
}

function getCenterAndRadiusByGeoBox(geoBox: IGeoBox): ICircle {
    // Calculate the center
    const center = {
        lat: (geoBox.topLeft.lat + geoBox.bottomRight.lat) / 2,
        lng: (geoBox.topLeft.lng + geoBox.bottomRight.lng) / 2,
    };

    // Calculate the radius using the Haversine formula
    const radius = haversineDistance(center, geoBox.topLeft);

    return { center, radius };
}

function getInfoPoint({
    marker,
    circle,
    polygon,
    line,
}: {
    marker?: IPoint;
    circle?: ICircle;
    polygon?: IPolygon;
    line?: ILine;
}): IPoint | undefined {
    if (marker) {
        return marker;
    }

    if (circle) {
        return circle.center;
    }

    if (polygon) {
        return getCenterPolygon(polygon);
    }

    if (line) {
        return getCenterPolygon(line);
    }

    return undefined;
}

function checkOverlapsPolygon(point: IPoint, polygon: IPolygon): boolean {
    const pointGeoJSON = turf.point([point.lng, point.lat]);
    const polygonGeoJSON = turf.polygon([polygon.points.map((p) => [p.lng, p.lat])]);

    return turf.booleanPointInPolygon(pointGeoJSON, polygonGeoJSON);
}

function pixelsToMeters(pixels: number, zoom: number): number {
    const metersPerPixel = (156543.03392 * Math.cos(0)) / 2 ** zoom;
    return pixels * metersPerPixel;
}

const opposite = (value: number) => (value > 0 ? value - 180 : value + 180);

const polygonCallout = (polygon: IPolygon, offsetInMeters: number): IPoint[] => {
    const turfPolygon = turf.polygon([[...polygon.points.map(createArrFromPoint), createArrFromPoint(polygon.points[0])]]);

    return polygon?.points.map((point, i) => {
        const lastIndex = polygon.points.length - 1;
        const prevIndex = i === 0 ? lastIndex : i - 1;
        const nextIndex = i === lastIndex ? 0 : i + 1;

        const turfPoint = turf.point(createArrFromPoint(point));

        const turfPrev = turf.point(createArrFromPoint(polygon.points[prevIndex]));
        const turfNext = turf.point(createArrFromPoint(polygon.points[nextIndex]));

        const bearingPrev = turf.bearing(turfPoint, turfPrev);
        const bearingNext = turf.bearing(turfPoint, turfNext);

        const bearing = (bearingPrev + bearingNext) / 2;

        const destination = turf.destination(turfPoint, offsetInMeters, bearing, {
            units: 'meters',
        });
        const opositeDestination = turf.destination(turfPoint, offsetInMeters, opposite(bearing), {
            units: 'meters',
        });

        return turf.booleanPointInPolygon(destination, turfPolygon)
            ? createPointFromArr(opositeDestination.geometry.coordinates)
            : createPointFromArr(destination.geometry.coordinates);
    });
};

const lineCallout = (line: ILine, offsetInMeters: number): IPoint[] =>
    line.points.length > 2
        ? polygonCallout(line, offsetInMeters)
        : line?.points.map((point) => {
              const turfPoint = turf.point(createArrFromPoint(point));
              const destination = turf.destination(turfPoint, offsetInMeters, 60, {
                  units: 'meters',
              });
              return createPointFromArr(destination.geometry.coordinates);
          });

function generatePolygonFromLines(line: ILine): IPolygon {
    const { width } = line;
    const points = [...(line.points ?? [])];
    const polygonPoints: IPoint[] = [];

    points.forEach((point, i) => {
        const lastIndex = points.length - 1;
        const prevIndex = i === 0 ? -1 : i - 1;
        const nextIndex = i === lastIndex ? -1 : i + 1;

        const turfPoint = turf.point(createArrFromPoint(point));

        if (prevIndex === -1) {
            const turfNext = turf.point(createArrFromPoint(points[nextIndex]));
            const bearing = turf.bearing(turfPoint, turfNext) - 90;
            const destination = turf.destination(turfPoint, width / 2, opposite(bearing), {
                units: 'meters',
            });
            polygonPoints.push(createPointFromArr(destination.geometry.coordinates));
        } else if (nextIndex === -1) {
            const turfPrev = turf.point(createArrFromPoint(points[prevIndex]));
            const bearing = turf.bearing(turfPoint, turfPrev) + 90;
            const destination = turf.destination(turfPoint, width / 2, opposite(bearing), {
                units: 'meters',
            });
            polygonPoints.push(createPointFromArr(destination.geometry.coordinates));
        } else {
            const turfPrev = turf.point(createArrFromPoint(points[prevIndex]));
            const turfNext = turf.point(createArrFromPoint(points[nextIndex]));

            const bearingPrev = turf.bearing(turfPoint, turfPrev);
            const bearingNext = turf.bearing(turfPoint, turfNext);

            const bearing = (bearingPrev + bearingNext) / 2;

            const opositeDestination = turf.destination(turfPoint, width / 2, opposite(bearing), {
                units: 'meters',
            });

            polygonPoints.push(createPointFromArr(opositeDestination.geometry.coordinates));
        }
    });

    points.reverse();

    points.forEach((point, i) => {
        const lastIndex = points.length - 1;
        const prevIndex = i === 0 ? -1 : i - 1;
        const nextIndex = i === lastIndex ? -1 : i + 1;

        const turfPoint = turf.point(createArrFromPoint(point));

        if (prevIndex === -1) {
            const turfNext = turf.point(createArrFromPoint(points[nextIndex]));
            const bearing = turf.bearing(turfPoint, turfNext) + 90;
            const destination = turf.destination(turfPoint, width / 2, bearing, {
                units: 'meters',
            });
            polygonPoints.push(createPointFromArr(destination.geometry.coordinates));
        } else if (nextIndex === -1) {
            const turfPrev = turf.point(createArrFromPoint(points[prevIndex]));
            const bearing = turf.bearing(turfPoint, turfPrev) - 90;
            const destination = turf.destination(turfPoint, width / 2, bearing, {
                units: 'meters',
            });
            polygonPoints.push(createPointFromArr(destination.geometry.coordinates));
        } else {
            const turfPrev = turf.point(createArrFromPoint(points[prevIndex]));
            const turfNext = turf.point(createArrFromPoint(points[nextIndex]));

            const bearingPrev = turf.bearing(turfPoint, turfPrev);
            const bearingNext = turf.bearing(turfPoint, turfNext);

            const bearing = (bearingPrev + bearingNext) / 2;

            const destination = turf.destination(turfPoint, width / 2, bearing, {
                units: 'meters',
            });

            polygonPoints.push(createPointFromArr(destination.geometry.coordinates));
        }
    });

    return {
        points: polygonPoints,
    };
}

export {
    getDistanceByPoints,
    getInfoPoint,
    getCenterAndRadiusByGeoBox,
    getGeoBoxByZoomOrRadius,
    getGeoBox,
    getArea,
    getTotalDistance,
    checkOverlapsPolygon,
    pixelsToMeters,
    polygonCallout,
    lineCallout,
    generatePolygonFromLines,
};
