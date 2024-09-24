import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { EXPLOSIVE_TYPE } from 'shared-my';

import { type IExplosiveAPI, type IExplosiveActionSumDTO, type IExplosiveDTO } from '~/api';
import { type ICreateValue } from '~/common';
import { dates } from '~/common';
import { CollectionModel, ListModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import {
    type IExplosive,
    type IExplosiveData,
    type IExplosiveActionData,
    type IExplosiveAction,
    createExplosive,
    createExplosiveDTO,
    Explosive,
    ExplosiveAction,
    createExplosiveActionSum,
} from './entities';
import { SumExplosiveActions } from './sum-explosive-actions';

export interface IExplosiveStore {
    collectionActions: CollectionModel<IExplosiveAction, IExplosiveActionData>;
    collection: CollectionModel<IExplosive, IExplosiveData>;
    list: ListModel<IExplosive, IExplosiveData>;
    searchList: ListModel<IExplosive, IExplosiveData>;
    sum: SumExplosiveActions;
    setSum(sum: IExplosiveActionSumDTO): void;
    append(res: IExplosiveDTO[], isSearch: boolean, isMore?: boolean): void;
    explosiveList: IExplosive[];
    detonatorList: IExplosive[];
    create: RequestModel<[ICreateValue<IExplosiveData>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[string]>;
    fetchMoreList: RequestModel<[string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
}

interface IApi {
    explosive: IExplosiveAPI;
}

interface IServices {
    message: IMessage;
}

export class ExplosiveStore implements IExplosiveStore {
    api: IApi;
    services: IServices;

    collectionActions = new CollectionModel<IExplosiveAction, IExplosiveActionData>({
        factory: (data: IExplosiveActionData) => new ExplosiveAction(data, this),
    });
    collection = new CollectionModel<IExplosive, IExplosiveData>({
        factory: (data: IExplosiveData) => new Explosive(data, this),
    });
    list = new ListModel<IExplosive, IExplosiveData>({ collection: this.collection });
    searchList = new ListModel<IExplosive, IExplosiveData>({ collection: this.collection });
    sum: SumExplosiveActions = new SumExplosiveActions();

    constructor(params: { api: IApi; services: IServices }) {
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    setSum(sum: IExplosiveActionSumDTO) {
        this.sum = createExplosiveActionSum(sum);
    }

    append(res: IExplosiveDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createExplosive), true);
    }

    get explosiveList() {
        return this.list.asArray.filter((el) => el.data.type === EXPLOSIVE_TYPE.EXPLOSIVE);
    }

    get detonatorList() {
        return this.list.asArray.filter((el) => el.data.type === EXPLOSIVE_TYPE.DETONATOR);
    }

    create = new RequestModel({
        run: async (data: ICreateValue<IExplosiveData>) => {
            const res = await this.api.explosive.create(createExplosiveDTO(data));

            this.list.unshift(createExplosive(res));
        },
        onSuccuss: () => this.services.message.success('Додано успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await this.api.explosive.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => this.services.message.success('Видалено успішно'),
        onError: () => this.services.message.error('Не вдалось видалити'),
    });

    fetchList = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return !(!isSearch && list.length);
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            if (!isSearch && list.length) return;

            const res = await this.api.explosive.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
    });

    fetchMoreList = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            if (!list.isMorePages) return;

            const res = await this.api.explosive.getList({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.data.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchItem = new RequestModel({
        run: async (id: string) => {
            const res = await this.api.explosive.get(id);

            this.collection.set(res.id, createExplosive(res));
        },
        onError: () => this.services.message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await this.api.explosive.sum({
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
