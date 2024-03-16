import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IUserDTO } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { createUser, IUser, IUserValue, User } from './entities';

const Store = types
	.model('UserStore', {
		collection: createCollection<IUser, IUserValue>("Users", User),
		listUnassigned: createList<IUser>("UserList", safeReference(User), { pageSize: 10 }),
	}).actions((self) => ({
		push: (values: IUserDTO[]) => {
			values.forEach((el) => {
				const value = createUser(el);
				if(!self.collection.has(value.id)){
					self.collection.set(value.id, value);
					self.listUnassigned.push(value.id);
				}
			})
		}
	}));

const fetchListUnassigned = asyncAction<Instance<typeof Store>>(() => async function fn({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();
		const res = await Api.user.getListUnassignedUsers();

		self.push(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const UserStore = Store.props({ fetchListUnassigned })
