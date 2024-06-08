import {
    ICircleDB,
    IGeoBoxDB,
    IGeoDB,
    IGeoPointDB,
    IMapViewActionDB,
    IPointDB,
    IPolygonDB,
} from '@/shared';
import { geohashForLocation, boundingBoxCoordinates } from 'geofire-common';

import { IPoint } from '~/types';

function getGeoPoint(point: IPointDB): IGeoPointDB {
    const hash = geohashForLocation([point.lat, point.lng]);

    return {
        ...point,
        hash,
    };
}

function getGeoBoxDB(topLeft: IPointDB, bottomRight: IPointDB): IGeoBoxDB {
    return {
        topLeft: getGeoPoint(topLeft),
        bottomRight: getGeoPoint(bottomRight),
    };
}

function getGeoBoxDBFromPolygon(polygon: IPolygonDB): IGeoBoxDB {
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

    return getGeoBoxDB({ lat: maxLat, lng: minLng }, { lat: minLat, lng: maxLng });
}

function getGeoBoxDBFromCircle(circle: ICircleDB): IGeoBoxDB {
    const { center, radius } = circle;

    const boundingBox = boundingBoxCoordinates([center.lat, center.lng], radius);

    return getGeoBoxDB(
        { lat: boundingBox[0][0], lng: boundingBox[0][1] },
        { lat: boundingBox[1][0], lng: boundingBox[1][1] },
    );
}

function getCenter(data: ICircleDB | IPolygonDB | IPointDB): IPoint {
    let center: IPointDB;

    if ('center' in data) {
        // If the data is a circle, use the center of the circle
        center = data.center;
    } else if ('points' in data) {
        // If the data is a polygon, calculate the centroid of the polygon
        const { points } = data;
        const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
        const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
        center = { lat, lng };
    } else {
        // If the data is a point, use the point itself
        center = data;
    }

    return center;
}

function getGeoDB(
    mapViewAction: Pick<IMapViewActionDB, 'circle' | 'polygon' | 'marker'>,
): IGeoDB | null {
    const { marker, circle, polygon } = mapViewAction;

    if (polygon) {
        const center = getCenter(polygon);
        const box = getGeoBoxDBFromPolygon(polygon);

        return {
            center: getGeoPoint(center),
            box,
        };
    }

    if (circle) {
        const center = getCenter(circle);
        const box = getGeoBoxDBFromCircle(circle);

        return {
            center: getGeoPoint(center),
            box,
        };
    }

    if (marker) {
        const center = getCenter(marker);

        return {
            center: getGeoPoint(center),
            box: null,
        };
    }

    return null;
}

export { getGeoDB, getCenter };
