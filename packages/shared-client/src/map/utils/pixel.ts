import { createPointLiteral } from './fabric';
import { type IPoint } from '../types';

function getPointByPixelOffset(
    latLng: IPoint | undefined | null,
    xOffset: number,
    yOffset: number,
    map: google.maps.Map | null | undefined,
    zoom: number,
): IPoint | null {
    if (!map || !latLng) {
        return null;
    }

    const scale = 2 ** (zoom ?? 1);
    const projection = map.getProjection();

    if (!projection) {
        return null;
    }

    const point = projection?.fromLatLngToPoint(latLng);

    if (!point) {
        return null;
    }

    point.x += xOffset / scale;
    point.y += yOffset / scale;

    const value = projection.fromPointToLatLng(point);

    if (!value) {
        return null;
    }

    return createPointLiteral(value);
}

/**
 * @returns px
 */
function getDistanceByPointsInPixels(point1: IPoint, point2: IPoint, map: google.maps.Map): number | null {
    const projection = map.getProjection();

    if (!projection) {
        return null;
    }

    // Convert the LatLng coordinates to pixel coordinates
    const pixelPoint1 = projection.fromLatLngToPoint(new google.maps.LatLng(point1.lat, point1.lng));
    const pixelPoint2 = projection.fromLatLngToPoint(new google.maps.LatLng(point2.lat, point2.lng));

    if (!pixelPoint1 || !pixelPoint2) {
        return null;
    }

    // Calculate the distance in world pixels using the Pythagorean theorem
    const dx = pixelPoint2.x - pixelPoint1.x;
    const dy = pixelPoint2.y - pixelPoint1.y;
    const distanceInWorldPixels = Math.sqrt(dx * dx + dy * dy);

    // Get the current zoom level
    const zoom = map.getZoom() ?? 1;

    // Convert the distance from world pixels to screen pixels
    const scaleFactor = 2 ** zoom;
    const distanceInScreenPixels = distanceInWorldPixels * scaleFactor;

    return distanceInScreenPixels;
}

export { getPointByPixelOffset, getDistanceByPointsInPixels };
