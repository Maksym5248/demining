import { message } from 'antd';

import { Api, IMapViewActionDTO } from '~/api';
import { IGeoBox, IGeohashRange } from '~/types';
import { mapUtils } from '~/utils';
import { CollectionModel, ICollectionModel, IListModel, ListModel, RequestModel } from '~/utils/models';

import { IMapViewAction, IMapViewActionValue, MapViewAction, createMapView } from './entities';

interface IGeohashes {
    start: string;
    end: string;
}

export interface IMapStore {
    collection: ICollectionModel<IMapViewAction, IMapViewActionValue>;
    list: IListModel<IMapViewAction, IMapViewActionValue>;
    loadedGeohashes: IGeohashes[];
    append: (res: IMapViewActionDTO | IMapViewActionDTO[]) => void;
    addLoadedGeohash: (geohash: IGeohashRange) => void;
    fetchAllInGeoBox: RequestModel<[IGeoBox]>;
}

export class MapStore implements IMapStore {
    collection = new CollectionModel<IMapViewAction, IMapViewActionValue>({
        factory: (data: IMapViewActionValue) => new MapViewAction(data),
    });
    list = new ListModel<IMapViewAction, IMapViewActionValue>({ collection: this.collection });
    loadedGeohashes: IGeohashes[] = [];

    append(res: IMapViewActionDTO | IMapViewActionDTO[]) {
        const value = Array.isArray(res) ? res : [res];
        this.list.push(value.map(createMapView), true);
    }

    addLoadedGeohash(geohash: IGeohashRange) {
        if (!this.loadedGeohashes.some((range) => range.start === geohash.start && range.end === geohash.end)) {
            this.loadedGeohashes.push(geohash);
        }
    }

    fetchAllInGeoBox = new RequestModel({
        shouldRun: (box: IGeoBox) => {
            const ranges = mapUtils.getGeohashRangesByGeoBox(box);
            const adjustedRanges = mapUtils.getAdjustedRanges(ranges, this.loadedGeohashes);

            return adjustedRanges.length !== 0;
        },
        run: async (box: IGeoBox) => {
            const ranges = mapUtils.getGeohashRangesByGeoBox(box);
            const adjustedRanges = mapUtils.getAdjustedRanges(ranges, this.loadedGeohashes);

            const res = await Api.map.getByGeohashRanges(adjustedRanges);

            this.append(res);
            adjustedRanges.forEach((range) => this.addLoadedGeohash(range));
        },
        onError: () => message.error('Виникла помилка'),
    });
}
