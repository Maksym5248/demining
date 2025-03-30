import { makeAutoObservable } from 'mobx';

import { type IDataModel } from '~/models';

import { type IMapViewActionData } from './map-view.schema';

export interface IMapViewAction extends IDataModel<IMapViewActionData> {}

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
