import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'

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
	createExplosiveObjectTypeDTO,
} from './entities';

const getStr = (v: IExplosiveObject) => v.caliber ? `${v.type.fullName} ${v.caliber}` : `${v.type.fullName} ${v.name}`

const Store = types
	.model('ExplosiveObjectStore', {
		collectionTypes: createCollection<IExplosiveObjectType, IExplosiveObjectTypeValue>("ExplosiveObjectTypes", ExplosiveObjectType),
		listTypes: createList<IExplosiveObjectType>("ExplosiveObjectTypesList", safeReference(ExplosiveObjectType), { pageSize: 20 }),
		collection: createCollection<IExplosiveObject, IExplosiveObjectValue>("ExplosiveObjects", ExplosiveObject),
		list: createList<IExplosiveObject>("ExplosiveObjectsList", safeReference(ExplosiveObject), { pageSize: 20 }),
	}).views(self => ({
		get sortedList(){
			return self.list.asArray.sort((a, b) => {
				const str1 = getStr(a);
				const str2 = getStr(b);
				return str1.localeCompare(str2, ["uk"], { numeric: true, sensitivity: 'base' })
			})
		},
		get sortedListTypes(){
			return self.listTypes.asArray.sort((a, b) => a.fullName.localeCompare(b.fullName, ["uk"], { numeric: true, sensitivity: 'base' }))
		}
	}));

const addType = asyncAction<Instance<typeof Store>>((data: CreateValue<IExplosiveObjectTypeValue>) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.explosiveObjectType.create(createExplosiveObjectTypeDTO(data));
		const value = createExplosiveObjectType(res);

		self.collectionTypes.set(res.id, value);
		self.listTypes.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось додати');
	}
});

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

const createExplosiveObjectsTypes = asyncAction<Instance<typeof Store>>(() => async function addFlow({ flow }) {
	try {
		flow.start();
		await Api.createExplosiveObjectsTypes();
		flow.success();
		message.success('Виконано успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось виконати');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();

		const res = await Api.explosiveObject.getList();

		res.forEach((el) => {
			const explosiveObjectType = createExplosiveObjectType(el.type);
			const explosiveObject = createExplosiveObject(el);

			if(!self.collectionTypes.has(explosiveObjectType.id)){
				self.collectionTypes.set(explosiveObjectType.id, explosiveObjectType);
			}

			if(!self.collection.has(explosiveObject.id)){
				self.collection.set(explosiveObject.id, explosiveObject);
				self.list.push(explosiveObject.id);
			}
		})

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchListTypes = asyncAction<Instance<typeof Store>>(() => async function addFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}

	try {
		flow.start();

		const res = await Api.explosiveObjectType.getList();
		self.listTypes.clear();
      
		res.forEach((el) => {
			const explosiveObjectType = createExplosiveObjectType(el);
			self.collectionTypes.set(explosiveObjectType.id, explosiveObjectType);
			self.listTypes.push(explosiveObjectType.id);
		})

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const ExplosiveObjectStore = Store.props({ create, addType, remove, fetchList, fetchListTypes, createExplosiveObjects, createExplosiveObjectsTypes })
