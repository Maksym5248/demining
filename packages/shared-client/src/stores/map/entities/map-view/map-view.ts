import { makeAutoObservable } from 'mobx';

import { type IMapViewActionData } from './map-view.schema';

export interface IMapViewAction {
    id: string;
    data: IMapViewActionData;
}

export class MapViewAction implements IMapViewAction {
    data: IMapViewActionData;

    constructor(data: IMapViewActionData) {
        this.data = data;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }
}
