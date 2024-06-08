import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { Api, IEquipmentDTO } from '~/api';
import { EQUIPMENT_TYPE } from '~/constants';
import { CreateValue } from '~/types';
import { dates } from '~/utils';

import {
    IEquipment,
    IEquipmentValue,
    Equipment,
    createEquipment,
    createEquipmentDTO,
    EquipmentAction,
} from './entities';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';

const Store = types
    .model('EquipmentStore', {
        collectionActions: createCollection<IEquipment, IEquipmentValue>(
            'EquipmentsActions',
            EquipmentAction,
        ),
        collection: createCollection<IEquipment, IEquipmentValue>('Equipments', Equipment),
        list: createList<IEquipment>('EquipmentsList', safeReference(Equipment), { pageSize: 10 }),
        searchList: createList<IEquipment>('EquipmentsSearchList', safeReference(Equipment), {
            pageSize: 10,
        }),
    })
    .views((self) => ({
        get listMineDetectors() {
            return self.list.asArray.filter((el) => el.type === EQUIPMENT_TYPE.MINE_DETECTOR);
        },
    }))
    .actions((self) => ({
        append(res: IEquipmentDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createEquipment(el);

                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
    }))
    .views((self) => ({
        get firstMineDetector() {
            return self.listMineDetectors[0];
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: CreateValue<IEquipmentValue>) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.equipment.create(createEquipmentDTO(data));
                const value = createEquipment(res);

                self.collection.set(res.id, value);
                self.list.unshift(res.id);
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

                await Api.equipment.remove(id);
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

                const res = await Api.equipment.getList({
                    search,
                    limit: list.pageSize,
                });

                self.append(res, isSearch);

                flow.success();
            } catch (err) {
                message.error('Виникла помилка');
                flow.failed(err as Error);
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

                const res = await Api.equipment.getList({
                    search,
                    limit: list.pageSize,
                    startAfter: dates.toDateServer(list.last.createdAt),
                });

                self.append(res, isSearch, true);

                flow.success();
            } catch (err) {
                message.error('Виникла помилка');
                flow.failed(err as Error);
            }
        },
);

const fetchItem = asyncAction<Instance<typeof Store>>(
    (id: string) =>
        async function fn({ flow, self }) {
            try {
                flow.start();
                const res = await Api.equipment.get(id);

                self.collection.set(res.id, createEquipment(res));

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const EquipmentStore = Store.props({ create, remove, fetchList, fetchListMore, fetchItem });
