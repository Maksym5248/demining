import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api, IEquipmentDTO } from '~/api'
import { EQUIPMENT_TYPE } from '~/constants';
import { dates } from '~/utils';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IEquipment, IEquipmentValue, Equipment, createEquipment, createEquipmentDTO } from './entities';

const Store = types
	.model('EquipmentStore', {
		collection: createCollection<IEquipment, IEquipmentValue>("Equipments", Equipment),
		list: createList<IEquipment>("EquipmentsList", safeReference(Equipment), { pageSize: 10 }),
	}).views(self => ({
		get listMineDetectors(){
			return self.list.asArray.filter(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)
		},
	})).actions((self) => ({
		push: (values: IEquipmentDTO[]) => {
			self.list.checkMore(values.length);
			values.forEach((el) => {
				const value = createEquipment(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		},
		set(values: IEquipmentDTO[]){
			self.list.checkMore(values.length);
			self.list.clear();

			values.forEach((el) => {
				const value = createEquipment(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		}
	})).views(self => ({
		get firstMineDetector(){
			return self.listMineDetectors[0]
		},
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IEquipmentValue>) => async function fn({ flow, self }) {
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
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {
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
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {    
	try {
		flow.start();

		const res = await Api.equipment.getList({
			search,
			limit: self.list.pageSize,
		});

		self.set(res);
		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

const fetchListMore = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {    
	try {
		if(!self.list.isMorePages) return;

		flow.start();

		const res = await Api.equipment.getList({
			search,
			limit: self.list.pageSize,
			startAfter: dates.toDateServer(self.list.last.createdAt),
		});

		self.push(res);

		flow.success();
	} catch (err) {
		message.error('Виникла помилка');
		flow.failed(err as Error);
	}
});

export const EquipmentStore = Store.props({ create, remove, fetchList, fetchListMore })
