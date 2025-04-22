import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type IMissionRequestAPI, type IMissionRequestSumDTO, type IMissionRequestTypeDTO } from '~/api';
import { type ISubscriptionDocument, type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IMissionRequest,
    type IMissionRequestData,
    type IMissionRequestType,
    type IMissionRequestTypeData,
    MissionRequest,
    MissionRequestType,
    createMissionRequest,
    createMissionRequestDTO,
    createMissionRequestSum,
    createMissionRequestType,
} from './entities';

export interface IMissionRequestStore {
    collection: CollectionModel<IMissionRequest, IMissionRequestData>;
    list: ListModel<IMissionRequest, IMissionRequestData>;
    sum: { total: number };
    setSum: (sum: IMissionRequestSumDTO) => void;
    create: RequestModel<[ICreateValue<IMissionRequestData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
    subscribeType: RequestModel;
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

    collectionType = new CollectionModel<IMissionRequestType, IMissionRequestTypeData>({
        factory: (data: IMissionRequestTypeData) => new MissionRequestType(data),
    });
    collection = new CollectionModel<IMissionRequest, IMissionRequestData>({
        factory: (data: IMissionRequestData) => new MissionRequest(data, this),
    });
    list = new ListModel<IMissionRequest, IMissionRequestData>({ collection: this.collection });
    sum = { total: 0 };

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setSum(sum: IMissionRequestSumDTO) {
        this.sum = createMissionRequestSum(sum);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IMissionRequestData>) => {
            const res = await this.api.missionRequest.create(createMissionRequestDTO(data));
            this.list.unshift(createMissionRequest(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.missionRequest.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.missionRequest.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createMissionRequest));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.missionRequest.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createMissionRequest));
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

    subscribeType = new RequestModel({
        cachePolicy: 'cache-first',
        run: async () => {
            await this.api.missionRequest.subscribeRequestType({}, (values: ISubscriptionDocument<IMissionRequestTypeDTO>[]) => {
                const create: IMissionRequestTypeData[] = [];
                const update: IMissionRequestTypeData[] = [];
                const remove: string[] = [];

                values.forEach(value => {
                    if (value.type === 'removed') {
                        remove.push(value.data.id);
                    } else if (value.type === 'added') {
                        create.push(createMissionRequestType(value.data));
                    } else if (value.type === 'modified') {
                        update.push(createMissionRequestType(value.data));
                    }
                });

                this.collectionType.set(create);
                this.collectionType.update(update);
                this.collectionType.remove(remove);
            });
        },
    });
}
