import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { Api, ICreateOrganizationDTO, IOrganizationDTO } from '~/api';
import { dates } from '~/utils';

import {
    IOrganization,
    IOrganizationValue,
    Organization,
    createOrganization,
    createOrganizationDTO,
} from './entities/organization';
import { asyncAction, createCollection, createList, safeReference } from '../../utils';

const Store = types
    .model('OrganizationStore', {
        collection: createCollection<IOrganization, IOrganizationValue>(
            'Organizations',
            Organization,
        ),
        list: createList<IOrganization>('OrganizationList', safeReference(Organization), {
            pageSize: 10,
        }),
        searchList: createList<IOrganization>(
            'OrganizationSearchList',
            safeReference(Organization),
            { pageSize: 10 },
        ),
    })
    .actions((self) => ({
        append(res: IOrganizationDTO[], isSearch: boolean, isMore?: boolean) {
            const list = isSearch ? self.searchList : self.list;
            if (isSearch && !isMore) self.searchList.clear();

            list.checkMore(res.length);

            res.forEach((el) => {
                const value = createOrganization(el);

                self.collection.set(value.id, value);
                if (!list.includes(value.id)) list.push(value.id);
            });
        },
    }));

const create = asyncAction<Instance<typeof Store>>(
    (data: ICreateOrganizationDTO) =>
        async function fn({ flow, self }) {
            try {
                flow.start();

                const res = await Api.organization.create(createOrganizationDTO(data));

                const value = createOrganization(res);

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

const remove = asyncAction<Instance<typeof Store>>((id: string) => async ({ flow, self }) => {
    try {
        flow.start();
        await Api.organization.remove(id);
        self.list.removeById(id);
        self.collection.remove(id);
        flow.success();
        message.success('Видалено успішно');
    } catch (err) {
        flow.failed(err as Error);
        message.error('Не вдалось видалити');
    }
});

const fetchList = asyncAction<Instance<typeof Store>>(
    (search: string) =>
        async function fn({ flow, self }) {
            try {
                const isSearch = !!search;
                const list = isSearch ? self.searchList : self.list;

                if (!isSearch && list.length) return;

                flow.start();

                const res = await Api.organization.getList({
                    search,
                    limit: list.pageSize,
                });

                self.append(res, isSearch);

                flow.success();
            } catch (err) {
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

                const res = await Api.organization.getList({
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
                const res = await Api.organization.get(id);

                if (!res) {
                    return;
                }

                const value = createOrganization(res);

                self.collection.set(value.id, value);

                flow.success();
            } catch (err) {
                flow.failed(err as Error);
                message.error('Виникла помилка');
            }
        },
);

export const OrganizationStore = Store.props({
    create,
    remove,
    fetchList,
    fetchListMore,
    fetchItem,
});
