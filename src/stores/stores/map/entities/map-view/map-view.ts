import { Instance } from 'mobx-state-tree';

import { types } from '../../../../types'

export type IMapViewAction = Instance<typeof MapViewAction>

export const LatLng = types.model('LatLng', {
	lat: types.number,
	lng: types.number,
});

export const Circle = types.model('Circle', {
	center: LatLng,
	radius: types.number
});

export const MapViewAction = types.model('MapViewAction', {
	id: types.identifier,
	marker: types.maybe(LatLng),
	circle: types.maybe(Circle),
	zoom: types.number,
	createdAt: types.dayjs,
	updatedAt: types.dayjs
});