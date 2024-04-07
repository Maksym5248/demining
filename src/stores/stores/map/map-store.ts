import { Instance, types } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IMapViewActionDTO } from '~/api';
import { IGeoBox } from '~/types';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IMapViewAction, IMapViewActionValue, MapViewAction, createMapView } from './entities';


const Store = types
	.model('MapStore', {
		collectionViewActions: createCollection<IMapViewAction, IMapViewActionValue>("MapViewActions", MapViewAction),
		list: createList<IMapViewAction>("MapViewActionList", safeReference(MapViewAction), { pageSize: 10 }),
	}).actions(self => ({
		append(res: IMapViewActionDTO[]){
			res.forEach((el) => {
				const value = createMapView(el);

				self.collectionViewActions.set(value.id, value);
				if(!self.list.includes(value.id)) self.list.push(value.id);
			})
		},
	}));


const fetchAllInGeoBox = asyncAction<Instance<typeof Store>>((box:IGeoBox) => async function addFlow({ flow, self }) {
	try {
		flow.start();
	
		const res = await Api.map.getAllInGeoBox(box);
		self.append(res);
	
		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const MapStore = Store.props({
	fetchAllInGeoBox,
})
