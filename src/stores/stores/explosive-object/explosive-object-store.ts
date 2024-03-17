import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IExplosiveObjectDTO } from '~/api'
import { explosiveObjectTypesData } from '~/data';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { 
	ExplosiveObject,
	ExplosiveObjectType,
	IExplosiveObject,
	IExplosiveObjectType,
	IExplosiveObjectValue,
	IExplosiveObjectTypeValue,
	IExplosiveObjectValueParams,
	createExplosiveObject,
	createExplosiveObjectDTO,
	createExplosiveObjectType,
} from './entities';

const Store = types
	.model('ExplosiveObjectStore', {
		collectionTypes: createCollection<IExplosiveObjectType, IExplosiveObjectTypeValue>("ExplosiveObjectTypes", ExplosiveObjectType),
		listTypes: createList<IExplosiveObjectType>("ExplosiveObjectTypesList", safeReference(ExplosiveObjectType), { pageSize: 100 }),
		collection: createCollection<IExplosiveObject, IExplosiveObjectValue>("ExplosiveObjects", ExplosiveObject),
		list: createList<IExplosiveObject>("ExplosiveObjectsList", safeReference(ExplosiveObject), { pageSize: 10 }),
		searchList: createList<IExplosiveObject>("ExplosiveObjectsSearchList", safeReference(ExplosiveObject), { pageSize: 10 }),
	}).views(self => ({
		get sortedListTypes(){
			return self.listTypes.asArray.sort((a, b) => a.fullName.localeCompare(b.fullName, ["uk"], { numeric: true, sensitivity: 'base' }))
		}
	})).actions(self => ({
		init() {
			explosiveObjectTypesData.forEach((el) => {
				const explosiveObjectType = createExplosiveObjectType(el);
	
				if(!self.collectionTypes.has(explosiveObjectType.id)){
					self.collectionTypes.set(explosiveObjectType.id, explosiveObjectType);
					self.listTypes.push(explosiveObjectType.id)
				}
			})
		},
		append(res: IExplosiveObjectDTO[], isSearch: boolean){
			const list = isSearch ? self.searchList : self.list;

			list.checkMore(res.length);

			res.forEach((el) => {
				const value = createExplosiveObject(el);

				self.collection.set(value.id, value);
				if(!list.includes(value.id)) list.push(value.id);
			})
		}
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IExplosiveObjectValueParams>) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.explosiveObject.create(createExplosiveObjectDTO(data));
		const value = createExplosiveObject(res);

		self.collection.set(res.id, value);
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addFlow({ flow, self }) {
	try {
		flow.start();
		await Api.explosiveObject.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

const createExplosiveObjects = asyncAction<Instance<typeof Store>>(() => async function addFlow({ flow }) {
	try {
		flow.start();
		await Api.createExplosiveObjects();
		flow.success();
		message.success('Виконано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось виконати');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchList : self.list

		if(!isSearch && !list.isMorePages) return;

		flow.start();

		const res = await Api.explosiveObject.getList({
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

const fetchListMore = asyncAction<Instance<typeof Store>>((search) => async function addFlow({ flow, self }) {
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchList : self.list

		if(!list.isMorePages) return;

		flow.start();

		const res = await Api.explosiveObject.getList({
			search,
			limit: list.pageSize,
			startAfter: dates.toDateServer(list.last.createdAt),
		});

		self.append(res, isSearch);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const ExplosiveObjectStore = Store.props({
	create,
	remove, 
	fetchList,
	fetchListMore, 
	createExplosiveObjects
})
