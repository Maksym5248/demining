import { message } from 'antd';

import { Api, type IUserDTO } from '~/api';
import { dates } from '~/utils';
import { CollectionModel, ListModel, RequestModel } from '~/utils/models';

import { createUser, type IUser, type IUserValue, User } from './entities';

export interface IUserStore {
    collection: CollectionModel<IUser, IUserValue>;
    listUnassigned: ListModel<IUser, IUserValue>;
    searchListUnassigned: ListModel<IUser, IUserValue>;
    fetchListUnassigned: RequestModel<[search?: string]>;
    fetchListUnassignedMore: RequestModel<[search?: string]>;
}

export class UserStore implements IUserStore {
    collection = new CollectionModel<IUser, IUserValue>({ model: User });
    listUnassigned = new ListModel<IUser, IUserValue>(this);
    searchListUnassigned = new ListModel<IUser, IUserValue>(this);

    append(res: IUserDTO[], isSearch: boolean, isMore?: boolean) {
        const list = isSearch ? this.searchListUnassigned : this.listUnassigned;
        if (isSearch && !isMore) this.searchListUnassigned.clear();

        list.checkMore(res.length);
        list.push(res.map(createUser), true);
    }

    fetchListUnassigned = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            return !(!isSearch && list.length);
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            const res = await Api.user.getListUnassignedUsers({
                search,
                limit: list.pageSize,
            });

            this.append(res, isSearch);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Виникла помилка'),
    });

    fetchListUnassignedMore = new RequestModel({
        shouldRun: (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            return list.isMorePages;
        },
        run: async (search?: string) => {
            const isSearch = !!search;
            const list = isSearch ? this.searchListUnassigned : this.listUnassigned;

            const res = await Api.user.getListUnassignedUsers({
                search,
                limit: list.pageSize,
                startAfter: dates.toDateServer(list.last.createdAt),
            });

            this.append(res, isSearch, true);
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Виникла помилка'),
    });
}
