import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IUserDTO } from '~/api'
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { createUser, IUser, IUserValue, User } from './entities';

const Store = types
	.model('UserStore', {
		collection: createCollection<IUser, IUserValue>("Users", User),
		listUnassigned: createList<IUser>("UnassignedUserList", safeReference(User), { pageSize: 10 }),
		searchListUnassigned: createList<IUser>("UnassignedUserSearchList", safeReference(User), { pageSize: 10 }),
	}).actions((self) => ({
		append(res: IUserDTO[], isSearch: boolean){
			const list = isSearch ? self.searchListUnassigned : self.listUnassigned;

			list.checkMore(res.length);

			res.forEach((el) => {
				const value = createUser(el);

				self.collection.set(value.id, value);
				if(!list.includes(value.id)) list.push(value.id);
			})
		}
	}));

const fetchListUnassigned = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {
	const isSearch = !!search;
	const list = isSearch ? self.searchListUnassigned : self.listUnassigned

	if(!isSearch && !list.isMorePages) return;
    
	try {
		flow.start();
		const res = await Api.user.getListUnassignedUsers({
			search,
			limit: list.pageSize,
		});

		self.append(res, isSearch);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchListUnassignedMore = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {    
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchListUnassigned : self.listUnassigned

		if(!list.isMorePages) return;

		flow.start();

		const res = await Api.user.getListUnassignedUsers({
			search,
			limit: list.pageSize,
			startAfter: dates.toDateServer(list.last.createdAt),
		});

		self.append(res, isSearch);

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

export const UserStore = Store.props({ fetchListUnassigned, fetchListUnassignedMore })
