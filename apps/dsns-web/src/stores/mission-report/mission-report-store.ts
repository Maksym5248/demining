import { message } from 'antd';
import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { Api, type IMissionReportDTO, type IMissionReportPreviewDTO, type IMissionReportSumDTO } from '~/api';
import { createMissionRequest, type IMissionRequestStore } from '~/stores/mission-request';
import { createOrder, type IOrderStore } from '~/stores/order';
import { type CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, ListModel, RequestModel } from '~/utils/models';

import {
    type IMissionReport,
    type IMissionReportValue,
    type IMissionReportValueParams,
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
import { type IMapStore } from '../map';
import { type ITransportStore, createTransportAction } from '../transport';

export interface IMissionReportStore {
    collection: CollectionModel<IMissionReport, IMissionReportValue>;
    list: ListModel<IMissionReport, IMissionReportValue>;
    searchList: ListModel<IMissionReport, IMissionReportValue>;
    sum: {
        total: number;
    };
    setSum: (sum: IMissionReportSumDTO) => void;
    appendToCollections: (data: IMissionReportDTO) => void;
    append: (res: IMissionReportPreviewDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: RequestModel<[CreateValue<IMissionReportValueParams>]>;
    update: RequestModel<[string, CreateValue<IMissionReportValueParams>]>;
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

interface MissionReportParams {
    stores: Stores;
}

export class MissionReportStore implements IMissionReportStore {
    stores: Stores;

    collection = new CollectionModel<IMissionReport, IMissionReportValue>({
        factory: (data: IMissionReportValue) => new MissionReport(data, this),
    });

    list = new ListModel<IMissionReport, IMissionReportValue>({ collection: this.collection });

    searchList = new ListModel<IMissionReport, IMissionReportValue>({ collection: this.collection });

    sum = {
        total: 0,
    };

    constructor(params: MissionReportParams) {
        this.stores = params.stores;

        makeAutoObservable(this);
    }

    setSum(sum: IMissionReportSumDTO) {
        this.sum = createMissionReportSum(sum);
    }
    appendToCollections(data: IMissionReportDTO) {
        this.stores.employee.collectionActions.set(data.approvedByAction?.id, createEmployeeAction(data.approvedByAction));
        this.stores.employee.collectionActions.set(data.squadLeaderAction?.id, createEmployeeAction(data.squadLeaderAction));
        this.stores.map.append(data.mapView);
        this.stores.employee.collectionActions.setArr(data.squadActions.map(createEmployeeAction));
        this.stores.explosiveObject.collectionActions.setArr(data.explosiveObjectActions.map(createExplosiveObjectAction));
        this.stores.transport.collectionActions.setArr(data.transportActions.map(createTransportAction));
        this.stores.equipment.collectionActions.setArr(data.equipmentActions.map(createEquipmentAction));
        this.stores.explosive.collectionActions.setArr(data.explosiveActions.map(createExplosiveAction));
        this.stores.order.collection.set(data.order.id, createOrder(data.order));
        this.stores.missionRequest.collection.set(data.missionRequest.id, createMissionRequest(data.missionRequest));
        this.collection.set(data.id, createMissionReport(data));
    }

    append(res: IMissionReportPreviewDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createMissionReportPreview), true);
    }

    create = new RequestModel({
        run: async (data: CreateValue<IMissionReportValueParams>) => {
            const res = await Api.missionReport.create(createMissionReportDTO(data));
            this.appendToCollections(res);
            this.list.unshift(createMissionReport(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Виникла помилка'),
    });

    update = new RequestModel({
        run: async (id: string, data: CreateValue<IMissionReportValueParams>) => {
            const res = await Api.missionReport.update(id, createMissionReportDTO(data));
            this.appendToCollections(res);
        },
        onSuccuss: () => message.success('Оновлено успішно'),
        onError: () => message.error('Виникла помилка'),
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

            const res = await Api.missionReport.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => message.error('Виникла помилка'),
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

            const res = await Api.missionReport.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await Api.missionReport.get(id);
            this.appendToCollections(res);
        },
        onError: () => message.error('Виникла помилка'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.missionReport.remove(id);
            this.list.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await Api.missionReport.sum({
                where: {
                    executedAt: {
                        '>=': dates.toDateServer(startDate),
                        '<=': dates.toDateServer(endDate),
                    },
                },
            });

            this.setSum(res);
        },
        onError: () => message.error('Виникла помилка'),
    });
}
