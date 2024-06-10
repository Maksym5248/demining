import { message } from 'antd';
import { Dayjs } from 'dayjs';
import { types, Instance } from 'mobx-state-tree';

import { Api, IMissionRequestDTO, IMissionRequestSumDTO } from '~/api';
import { CreateValue } from '~/types';
import { dates } from '~/utils';
import { CollectionModel, ListModel, RequestModel } from '~/utils/models';

import {
    IMissionRequest,
    IMissionRequestValue,
    MissionRequest,
    createMissionRequest,
    createMissionRequestDTO,
    createMissionRequestSum,
} from './entities';

export interface IMissionRequestStore {
    collection: CollectionModel<IMissionRequest, IMissionRequestValue>;
    list: ListModel<IMissionRequest, IMissionRequestValue>;
    searchList: ListModel<IMissionRequest, IMissionRequestValue>;
    sum: { total: number };
    setSum: (sum: IMissionRequestSumDTO) => void;
    append: (res: IMissionRequestDTO[], isSearch: boolean, isMore?: boolean) => void;
    create: RequestModel<[CreateValue<IMissionRequestValue>]>;
    remove: RequestModel<[string]>;
    fetchList: RequestModel<[string]>;
    fetchListMore: RequestModel<[string]>;
    fetchItem: RequestModel<[string]>;
    fetchSum: RequestModel<[Dayjs, Dayjs]>;
}

export class MissionRequestStore implements IMissionRequestStore {
    collection = new CollectionModel<IMissionRequest, IMissionRequestValue>({
        factory: (data: IMissionRequestValue) => new MissionRequest(data),
    });
    list = new ListModel<IMissionRequest, IMissionRequestValue>({ collection: this.collection });
    searchList = new ListModel<IMissionRequest, IMissionRequestValue>({ collection: this.collection });
    sum = { total: 0 };

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
        run: async (data: CreateValue<IMissionRequestValue>) => {
            const res = await Api.missionRequest.create(createMissionRequestDTO(data));
            this.list.unshift(createMissionRequest(res));
        },
        onSuccuss: () => message.success('Додано успішно'),
        onError: () => message.error('Не вдалось додати'),
    });

    remove = new RequestModel({
        run: async (id: string) => {
            await Api.missionRequest.remove(id);
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

            const res = await Api.missionRequest.getList({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchListMore = new RequestModel({
        shouldRun: (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            return list.isMorePages;
        },
        run: async (search: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchList : this.list;

            const res = await Api.missionRequest.getList({
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
            const res = await Api.missionRequest.get(id);

            this.collection.set(res.id, createMissionRequest(res));
        },
        onError: () => message.error('Виникла помилка'),
    });

    fetchSum = new RequestModel({
        run: async (startDate: Dayjs, endDate: Dayjs) => {
            const res = await Api.missionRequest.sum({
                where: {
                    createdAt: {
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
