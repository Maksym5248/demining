import { Instance, types } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IMapViewActionDTO } from '~/api';
import { IGeoBox, IGeohashRange } from '~/types';
import { mapUtils } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMapViewAction, IMapViewActionValue, MapViewAction, createMapView } from './entities';

const Store = types
	.model('MapStore', {
		collectionViewActions: createCollection<IMapViewAction, IMapViewActionValue>("MapViewActions", MapViewAction),
		list: createList<IMapViewAction>("MapViewActionList", safeReference(MapViewAction), { pageSize: 10 }),
		loadedGeohashes: types.optional(types.array(types.model({
			start: types.string,
			end: types.string
		})), []),
	}).actions(self => ({
		append(res: IMapViewActionDTO | IMapViewActionDTO[]){
			const v = Array.isArray(res) ? res : [res];

			v.forEach((el) => {
				const value = createMapView(el);

				self.collectionViewActions.set(value.id, value);
				if(!self.list.includes(value.id)) self.list.push(value.id);
			})
		},
		addLoadedGeohash(geohash: IGeohashRange) {
			if (!self.loadedGeohashes.some(range => range.start === geohash.start && range.end === geohash.end)) {
			  self.loadedGeohashes.push(geohash);
			}
		  },
	}));


const fetchAllInGeoBox = asyncAction<Instance<typeof Store>>((box:IGeoBox) => async function addFlow({ flow, self }) {
	try {
		const ranges = mapUtils.getGeohashRangesByGeoBox(box);
		const adjustedRanges = mapUtils.getAdjustedRanges(ranges, self.loadedGeohashes);
		console.log("adjustedRanges", adjustedRanges)
		if(adjustedRanges.length === 0) return;	

		flow.start();

		const res = await Api.map.getByGeohashRanges(adjustedRanges);

		self.append(res);
		adjustedRanges.forEach(range => self.addLoadedGeohash(range));
		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const MapStore = Store.props({
	fetchAllInGeoBox,
})
