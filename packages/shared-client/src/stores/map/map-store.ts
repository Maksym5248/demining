import { makeAutoObservable } from 'mobx';

import { type IMapAPI } from '~/api';
import { type IGeoBox, type IGeohashRange, mapUtils } from '~/map';
import { CollectionModel, type ICollectionModel, type IListModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type IMapViewAction, type IMapViewActionData, MapViewAction, createMapView } from './entities';

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
    collection: ICollectionModel<IMapViewAction, IMapViewActionData>;
    list: IListModel<IMapViewAction, IMapViewActionData>;
    loadedGeohashes: IGeohashes[];
    addLoadedGeohash: (geohash: IGeohashRange) => void;
    fetchAllInGeoBox: RequestModel<[IGeoBox]>;
    fetchAll: RequestModel;
    isLoaded: boolean;
}

export class MapStore implements IMapStore {
    api: IApi;
    services: IServices;
    collection = new CollectionModel<IMapViewAction, IMapViewActionData>({
        factory: (data: IMapViewActionData) => new MapViewAction(data),
    });
    list = new ListModel<IMapViewAction, IMapViewActionData>({ collection: this.collection });
    loadedGeohashes: IGeohashes[] = [];

    isLoaded = false;

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    addLoadedGeohash(geohash: IGeohashRange) {
        if (!this.loadedGeohashes.some(range => range.start === geohash.start && range.end === geohash.end)) {
            this.loadedGeohashes.push(geohash);
        }
    }

    fetchAll = new RequestModel({
        shouldRun: () => !this.isLoaded,
        run: async () => {
            const res = await this.api.map.getList();

            this.list.set(res.map(createMapView));

            this.isLoaded = true;
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchAllInGeoBox = new RequestModel({
        shouldRun: (box?: IGeoBox) => {
            if (!box || this.isLoaded) return false;

            const ranges = mapUtils.getGeohashRangesByGeoBox(box);
            const adjustedRanges = mapUtils.getAdjustedRanges(ranges, this.loadedGeohashes);

            return adjustedRanges.length !== 0;
        },
        run: async (box: IGeoBox) => {
            const ranges = mapUtils.getGeohashRangesByGeoBox(box);
            const adjustedRanges = mapUtils.getAdjustedRanges(ranges, this.loadedGeohashes);

            const res = await this.api.map.getByGeohashRanges(adjustedRanges);

            this.list.push(res.map(createMapView));
            adjustedRanges.forEach(range => this.addLoadedGeohash(range));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
