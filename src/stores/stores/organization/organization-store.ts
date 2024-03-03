import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, ICreateOrganizationDTO, IOrganizationDTO } from '~/api'

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IOrganization, IOrganizationValue, Organization, createOrganization, createOrganizationDTO } from './entities/organization';

const Store = types
	.model('OrganizationStore', {
		collection: createCollection<IOrganization, IOrganizationValue>("Organizations", Organization),
		list: createList<IOrganization>("OrganizationList", safeReference(Organization), { pageSize: 20 }),
	}).actions((self) => ({
		push: (values: IOrganizationDTO[]) => {
			values.forEach((el) => {
				const value = createOrganization(el);

				if(!self.collection.has(value.id)){
					self.collection.set(value.id, value);
					self.list.push(value.id);
				}
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: ICreateOrganizationDTO) => async function addEmployeeFlow({ flow, self }) {
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
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async ({ flow, self }) => {
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

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();
		const res = await Api.organization.getList();

		self.push(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

const fetchById = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();
		const res = await Api.organization.get(id);

		if(!res){
			return
		}

		const value = createOrganization(res);

		self.collection.set(value.id, value);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const OrganizationStore = Store.props({ create, remove, fetchList, fetchById })
