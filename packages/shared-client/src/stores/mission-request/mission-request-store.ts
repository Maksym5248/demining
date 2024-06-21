import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type IMissionRequestAPI, type IMissionRequestDTO, type IMissionRequestSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';

import {
    type IMissionRequest,
    type IMissionRequestValue,
    MissionRequest,
    createMissionRequest,
    createMissionRequestDTO,
    createMissionRequestSum,
} from './entities';
import { IMessage } from '~/services';

export interface IMissionRequestStore {
    collection: CollectionModel<IMissionRequest, IMissionRequestValue>;
    list: ListModel<IMissionRequest, IMissionRequestValue>;
    searchList: ListModel<IMissionRequest, IMissionRequestValue>;
    sum: { total: number };
    setSum: (sum: IMissionRequestSumDTO) => void;
    append: (res: IMissionRequestDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: RequestModel<[ICreateValue<IMissionRequestValue>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
}

interface IApi {
    missionRequest: IMissionRequestAPI;
}

interface IServices {
    message: IMessage;
}

export class MissionRequestStore implements IMissionRequestStore {
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IMissionRequest, IMissionRequestValue>({
        factory: (data: IMissionRequestValue) => new MissionRequest(data, this),
    });
    list = new ListModel<IMissionRequest, IMissionRequestValue>({ collection: this.collection });
    searchList = new ListModel<IMissionRequest, IMissionRequestValue>({
        collection: this.collection,
    });
    sum = { total: 0 };

    constructor(params: { api: IApi, services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setSum(sum: IMissionRequestSumDTO) {
        this.sum = createMissionRequestSum(sum);
    }

    append(res: IMissionRequestDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createMissionRequest), true);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IMissionRequestValue>) => {
            const res = await this.api.missionRequest.create(createMissionRequestDTO(data));
            this.list.unshift(createMissionRequest(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.missionRequest.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.missionRequest.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await this.api.missionRequest.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.missionRequest.get(id);

            this.collection.set(res.id, createMissionRequest(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.missionRequest.sum({
                where: {
                    createdAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });
}
