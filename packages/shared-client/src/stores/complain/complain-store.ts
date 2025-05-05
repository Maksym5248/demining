import { makeAutoObservable } from 'mobx';

import { type IComplainAPI } from '~/api';
import { type ICreateValue } from '~/common';
import { RequestModel, type IRequestModel } from '~/models';

import { createComplainDTO, type ICreateComplainData, type IComplainData } from './entities';
import { type IUserStore } from '../user';
import { type IViewerStore } from '../viewer';

export interface IComplainStore {
    create: IRequestModel<[ICreateValue<IComplainData>]>;
}

interface IApi {
    complain: IComplainAPI;
}

interface IStores {
    user: IUserStore;
    viewer: IViewerStore;
}

interface IServices {
    localization: {
        data: {
            locale: string;
        };
    };
}

export class ComplainStore implements IComplainStore {
    api: IApi;
    getStores: () => IStores;
    services: IServices;

    constructor(params: { api: IApi; getStores: () => IStores; services: IServices }) {
        this.api = params.api;
        this.getStores = params.getStores;
        this.services = params.services;

        makeAutoObservable(this);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<ICreateComplainData>) => {
            await this.api.complain.create(
                createComplainDTO({
                    ...data,
                    originalLang: this.services.localization.data.locale,
                }),
            );
        },
    });
}
