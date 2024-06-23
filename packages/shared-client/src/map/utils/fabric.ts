import { type IPoint } from '../types';

const createPointLiteral = (latLng: google.maps.LatLng) => ({
    lng: latLng?.lng(),
    lat: latLng?.lat(),
});

const createPointFromArr = (value: number[]) => ({
    lat: value[1],
    lng: value[0],
});

const createArrFromPoint = (point: IPoint) => [point.lng, point.lat];

export { createPointLiteral, createPointFromArr, createArrFromPoint };
