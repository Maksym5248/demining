import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { Api, ITransportDTO } from '~/api';
import { TRANSPORT_TYPE } from '~/constants';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import {
    ITransport,
    ITransportAction,
    ITransportActionValue,
    ITransportValue,
    Transport,
    TransportAction,
    createTransport,
    createTransportDTO,
} from './entities';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';

const Store = types
    .model('TransportStore', {
        collectionActions: createCollection<ITransportAction, ITransportActionValue>(
            'TransportsActions',
            TransportAction,
        ),
        collection: createCollection<ITransport, ITransportValue>('Transports', Transport),
        list: createList<ITransport>('TransportsList', safeReference(Transport), { pageSize: 10 }),
        searchList: createList<ITransport>('EquipmentsSearchList', safeReference(Transport), {
            pageSize: 10,
        }),
    })
    .actions((self) => ({
        append(res: ITransportDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createTransport(el);

                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
    }))
    .views((self) => ({
        get transportExplosiveObjectList() {
            return self.list.asArray.filter(
                (el) => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
            );
        },
        get transportHumansList() {
            return self.list.asArray.filter((el) => el.type === TRANSPORT_TYPE.FOR_HUMANS);
        },
    }))
    .views((self) => ({
        get transportExplosiveObjectFirst() {
            return self.transportExplosiveObjectList[0];
        },
        get transportHumansFirst() {
            return self.transportHumansList[0];
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: CreateValue<ITransportValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.transport.create(createTransportDTO(data));
                const value = createTransport(res);

                self.collection.set(value.id, value);
                self.list.unshift(value.id);
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
                await Api.transport.remove(id);
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

                const res = await Api.transport.getList({
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

                const res = await Api.transport.getList({
                    search,
                    limit: list.pageSize,
                    startAfter: dates.toDateServer(list.last.createdAt),
                });

                self.append(res, isSearch, true);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

const fetchItem = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                const res = await Api.transport.get(id);

                self.collection.set(res.id, createTransport(res));

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const TransportStore = Store.props({ create, remove, fetchList, fetchListMore, fetchItem });
