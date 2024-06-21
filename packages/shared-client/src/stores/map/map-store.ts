import { makeAutoObservable } from 'mobx';

import { type IMapAPI, type IMapViewActionDTO } from '~/api';
import { type IGeoBox, type IGeohashRange, mapUtils } from '~/map';
import { CollectionModel, type ICollectionModel, type IListModel, ListModel, RequestModel } from '~/models';

import { type IMapViewAction, type IMapViewActionValue, MapViewAction, createMapView } from './entities';
import { IMessage } from '~/services';

interface IApi {
    map: IMapAPI;
}

interface IServices {
    message: IMessage;
}
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
    api: IApi;
    services: IServices;
    collection = new CollectionModel<IMapViewAction, IMapViewActionValue>({
        factory: (data: IMapViewActionValue) => new MapViewAction(data),
    });
    list = new ListModel<IMapViewAction, IMapViewActionValue>({ collection: this.collection });
    loadedGeohashes: IGeohashes[] = [];

    constructor(params: { api: IApi, services: IServices}) {
        this.api = params.api;
        this.services = params.services;
        
        makeAutoObservable(this);
    }

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

            const res = await this.api.map.getByGeohashRanges(adjustedRanges);

            this.append(res);
            adjustedRanges.forEach((range) => this.addLoadedGeohash(range));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
