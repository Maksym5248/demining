import { types } from 'mobx-state-tree';

import { createCollection } from '../../utils';
import { IMapViewAction, IMapViewActionValue, MapViewAction } from './entities';

const Store = types
	.model('MapStore', {
		collectionViewActions: createCollection<IMapViewAction, IMapViewActionValue>("MissionRequests", MapViewAction),
	});

export const MapStore = Store
