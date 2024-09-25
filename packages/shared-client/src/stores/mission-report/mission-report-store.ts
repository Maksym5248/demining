import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { type IMissionReportAPI, type IMissionReportDTO, type IMissionReportSumDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';
import { createMissionRequest, type IMissionRequestStore } from '~/stores/mission-request';
import { createOrder, type IOrderStore } from '~/stores/order';

import {
    type IMissionReport,
    type IMissionReportData,
    type IMissionReportDataParams,
    MissionReport,
    createMissionReport,
    createMissionReportDTO,
    createMissionReportPreview,
    createMissionReportSum,
} from './entities';
import { type IEmployeeStore, createEmployeeAction } from '../employee';
import { type IEquipmentStore, createEquipmentAction } from '../equipment';
import { type IExplosiveStore, createExplosiveAction } from '../explosive';
import { type IExplosiveObjectStore, createExplosiveObjectAction } from '../explosive-object';
import { createMapView, type IMapStore } from '../map';
import { type ITransportStore, createTransportAction } from '../transport';

interface IServices {
    message: IMessage;
}

export interface IMissionReportStore {
    collection: CollectionModel<IMissionReport, IMissionReportData>;
    list: ListModel<IMissionReport, IMissionReportData>;
    sum: {
        total: number;
    };
    setSum: (sum: IMissionReportSumDTO) => void;
    appendToCollections: (data: IMissionReportDTO) => void;
    create: RequestModel<[ICreateValue<IMissionReportDataParams>]>;
    update: RequestModel<[string, ICreateValue<IMissionReportDataParams>]>;
    fetchList: RequestModel<[search?: string]>;
    fetchMoreList: RequestModel<[search?: string]>;
    fetchItem: RequestModel<[string]>;
    remove: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
}

interface Stores {
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveObject: IExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionRequest: IMissionRequestStore;
    order: IOrderStore;
    transport: ITransportStore;
}

interface IApi {
    missionReport: IMissionReportAPI;
}

interface MissionReportParams {
    stores: Stores;
    api: IApi;
    services: IServices;
}

export class MissionReportStore implements IMissionReportStore {
    stores: Stores;
    api: IApi;
    services: IServices;

    collection = new CollectionModel<IMissionReport, IMissionReportData>({
        factory: (data: IMissionReportData) => new MissionReport(data, this),
    });

    list = new ListModel<IMissionReport, IMissionReportData>({ collection: this.collection });

    sum = {
        total: 0,
    };

    constructor(params: MissionReportParams) {
        this.stores = params.stores;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setSum(sum: IMissionReportSumDTO) {
        this.sum = createMissionReportSum(sum);
    }
    appendToCollections(data: IMissionReportDTO) {
        this.stores.employee.collectionActions.set(data.approvedByAction?.id, createEmployeeAction(data.approvedByAction));
        this.stores.employee.collectionActions.set(data.squadLeaderAction?.id, createEmployeeAction(data.squadLeaderAction));
        this.stores.map.collection.set(data.mapView.id, createMapView(data.mapView));
        this.stores.employee.collectionActions.setArr(data.squadActions.map(createEmployeeAction));
        this.stores.explosiveObject.collectionActions.setArr(data.explosiveObjectActions.map(createExplosiveObjectAction));
        this.stores.transport.collectionActions.setArr(data.transportActions.map(createTransportAction));
        this.stores.equipment.collectionActions.setArr(data.equipmentActions.map(createEquipmentAction));
        this.stores.explosive.collectionActions.setArr(data.explosiveActions.map(createExplosiveAction));
        this.stores.order.collection.set(data.order.id, createOrder(data.order));
        this.stores.missionRequest.collection.set(data.missionRequest.id, createMissionRequest(data.missionRequest));
        this.collection.set(data.id, createMissionReport(data));
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IMissionReportDataParams>) => {
            const res = await this.api.missionReport.create(createMissionReportDTO(data));
            this.appendToCollections(res);
            this.list.unshift(createMissionReport(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Виникла помилка'),
    });

    update = new RequestModel({
        run: async (id: string, data: ICreateValue<IMissionReportDataParams>) => {
            const res = await this.api.missionReport.update(id, createMissionReportDTO(data));
            this.appendToCollections(res);
        },
        onSuccuss: () => this.services.message.success('Оновлено успішно'),
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchList = new RequestModel({
        run: async (search?: string) => {
            const res = await this.api.missionReport.getList({
                search,
                limit: this.list.pageSize,
            });

            this.list.set(res.map(createMissionReportPreview));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchMoreList = new RequestModel({
        shouldRun: () => this.list.isMorePages,
        run: async (search?: string) => {
            const res = await this.api.missionReport.getList({
                search,
                limit: this.list.pageSize,
                startAfter: dates.toDateServer(this.list.last.data.createdAt),
            });

            this.list.push(res.map(createMissionReportPreview));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.missionReport.get(id);
            this.appendToCollections(res);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.missionReport.remove(id);
            this.list.remove(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.missionReport.sum({
                where: {
                    executedAt: {
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
