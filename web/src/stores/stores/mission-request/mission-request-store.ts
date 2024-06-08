import { message } from 'antd';
import { Dayjs } from 'dayjs';
import { types, Instance } from 'mobx-state-tree';

import { Api, IMissionRequestDTO, IMissionRequestSumDTO } from '~/api';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import {
    IMissionRequest,
    IMissionRequestValue,
    MissionRequest,
    createMissionRequest,
    createMissionRequestDTO,
    createMissionRequestSum,
} from './entities';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';

const SumMissionRequest = types.model('SumMissionRequest', {
    total: types.number,
});

const Store = types
    .model('MissionRequestStore', {
        collection: createCollection<IMissionRequest, IMissionRequestValue>(
            'MissionRequests',
            MissionRequest,
        ),
        list: createList<IMissionRequest>('MissionRequestsList', safeReference(MissionRequest), {
            pageSize: 10,
        }),
        searchList: createList<IMissionRequest>(
            'ExplosiveObjectsSearchList',
            safeReference(MissionRequest),
            { pageSize: 10 },
        ),
        sum: types.optional(SumMissionRequest, {
            total: 0,
        }),
    })
    .actions((self) => ({
        setSum(sum: IMissionRequestSumDTO) {
            self.sum = createMissionRequestSum(sum);
        },
        append(res: IMissionRequestDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createMissionRequest(el);

                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: CreateValue<IMissionRequestValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.missionRequest.create(createMissionRequestDTO(data));
                const missionRequest = createMissionRequest(res);

                self.collection.set(missionRequest.id, missionRequest);
                self.list.unshift(missionRequest.id);
                flow.success();
                message.success('Додано успішно');
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось додати');
            }
        },
);

const remove = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                await Api.missionRequest.remove(id);
                self.list.removeById(id);
                self.collection.remove(id);
                flow.success();
                message.success('Видалено успішно');
            } catch (err) {
                flow.failed(err as Error);
                message.error('Не вдалось видалити');
            }
        },
);

const fetchList = asyncAction<Instance<typeof Store>>(
    (search: string) =>
        async function fn({ flow, self }) {
            try {
                const isSearch = !!search;
                const list = isSearch ? self.searchList : self.list;

                if (!isSearch && list.length) return;

                flow.start();

                const res = await Api.missionRequest.getList({
                    search,
                    limit: list.pageSize,
                });

                self.append(res, isSearch);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

const fetchListMore = asyncAction<Instance<typeof Store>>(
    (search: string) =>
        async function fn({ flow, self }) {
            try {
                const isSearch = !!search;
                const list = isSearch ? self.searchList : self.list;

                if (!list.isMorePages) return;

                flow.start();

                const res = await Api.missionRequest.getList({
                    search,
                    limit: list.pageSize,
                    startAfter: dates.toDateServer(list.last.createdAt),
                });

                self.append(res, isSearch, true);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
            }
        },
);

const fetchItem = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                const res = await Api.missionRequest.get(id);

                self.collection.set(res.id, createMissionRequest(res));

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

const fetchSum = asyncAction<Instance<typeof Store>>(
    (startDate: Dayjs, endDate: Dayjs) =>
        async function addFlow({ flow, self }) {
            try {
                flow.start();

                const res = await Api.missionRequest.sum({
                    where: {
                        createdAt: {
                            '>=': dates.toDateServer(startDate),
                            '<=': dates.toDateServer(endDate),
                        },
                    },
                });

                self.setSum(res);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const MissionRequestStore = Store.props({
    create,
    remove,
    fetchList,
    fetchListMore,
    fetchItem,
    fetchSum,
});
