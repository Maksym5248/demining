import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'

export type IMapViewAction = Instance<typeof MapViewAction>

export const Point = types.model('LatLng', {
	lat: types.number,
	lng: types.number,
});

export const Circle = types.model('Circle', {
	center: Point,
	radius: types.number
});

export const Line = types.model('Line', {
	points: types.array(Point),
	width: types.number,
});

export const Polygon = types.model('Polygon', {
	points: types.array(Point),
});

export const MapViewAction = types.model('MapViewAction', {
	id: types.identifier,
	marker: types.maybe(Point),
	circle: types.maybe(Circle),
	polygon: types.maybe(Polygon),
	line: types.maybe(Line),
	zoom: types.number,
	createdAt: types.dayjs,
	updatedAt: types.dayjs
});