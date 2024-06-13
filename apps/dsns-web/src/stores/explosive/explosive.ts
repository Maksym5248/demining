import { message } from 'antd';
import { type Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';

import { Api, type IExplosiveActionSumDTO, type IExplosiveDTO } from '~/api';
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';
import { type CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, ListModel, RequestModel } from '~/utils/models';

import {
    type IExplosive,
    type IExplosiveValue,
    type IExplosiveActionValue,
    type IExplosiveAction,
    createExplosive,
    createExplosiveDTO,
    Explosive,
    ExplosiveAction,
    createExplosiveActionSum,
} from './entities';
import { SumExplosiveActions } from './sum-explosive-actions';

export interface IExplosiveStore {
    collectionActions: CollectionModel<IExplosiveAction, IExplosiveActionValue>;
    collection: CollectionModel<IExplosive, IExplosiveValue>;
    list: ListModel<IExplosive, IExplosiveValue>;
    searchList: ListModel<IExplosive, IExplosiveValue>;
    sum: SumExplosiveActions;
    setSum(sum: IExplosiveActionSumDTO): void;
    append(res: IExplosiveDTO[], isSearch: boolean, isMore?: boolean): void;
    explosiveList: IExplosive[];
    detonatorList: IExplosive[];
    create: RequestModel<[CreateValue<IExplosiveValue>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[string]>;
    fetchMoreList: RequestModel<[string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
}

export class ExplosiveStore implements IExplosiveStore {
    collectionActions = new CollectionModel<IExplosiveAction, IExplosiveActionValue>({
        factory: (data: IExplosiveActionValue) => new ExplosiveAction(data),
    });
    collection = new CollectionModel<IExplosive, IExplosiveValue>({
        factory: (data: IExplosiveValue) => new Explosive(data),
    });
    list = new ListModel<IExplosive, IExplosiveValue>({ collection: this.collection });
    searchList = new ListModel<IExplosive, IExplosiveValue>({ collection: this.collection });
    sum: SumExplosiveActions = new SumExplosiveActions();

    constructor() {
        makeAutoObservable(this);
    }

    setSum(sum: IExplosiveActionSumDTO) {
        this.sum = createExplosiveActionSum(sum);
    }

    append(res: IExplosiveDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchList : this.list;
        if (isSearch && !isMore) this.searchList.clear();

        list.checkMore(res.length);
        list.push(res.map(createExplosive));
    }

    get explosiveList() {
        return this.list.asArray.filter((el) => el.type === EXPLOSIVE_TYPE.EXPLOSIVE);
    }

    get detonatorList() {
        return this.list.asArray.filter((el) => el.type === EXPLOSIVE_TYPE.DETONATOR);
    }

    create = new RequestModel({
        run: async (data: CreateValue<IExplosiveValue>) => {
            const res = await Api.explosive.create(createExplosiveDTO(data));

            this.list.unshift(createExplosive(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.explosive.remove(id);
            this.list.removeById(id);
            this.searchList.removeById(id);
            this.collection.remove(id);
        },
        onSuccuss: () => message.success('Видалено успішно'),
        onError: () => message.error('Не вдалось видалити'),
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

            const res = await Api.explosive.getList({
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

            const res = await Api.explosive.getList({
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
            const res = await Api.explosive.get(id);

            this.collection.set(res.id, createExplosive(res));
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await Api.explosive.sum({
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
