import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { CreateValue } from '~/types'
import { Api } from '~/api'
import { EQUIPMENT_TYPE } from '~/constants';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { IEquipment, IEquipmentValue, Equipment, createEquipment, createEquipmentDTO } from './entities';

const Store = types
	.model('EquipmentStore', {
		collection: createCollection<IEquipment, IEquipmentValue>("Equipments", Equipment),
		list: createList<IEquipment>("EquipmentsList", safeReference(Equipment), { pageSize: 20 }),
	}).views(self => ({
		get listMineDetectors(){
			return self.list.asArray.filter(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)
		},
	})).views(self => ({
		get firstMineDetector(){
			return self.listMineDetectors[0]
		},
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IEquipmentValue>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.equipment.create(createEquipmentDTO(data));
		const value = createEquipment(res);

		self.collection.set(res.id, value);
		self.list.unshift(res.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		console.log("remove")
		await Api.equipment.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		message.error('Не вдалось видалити');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>(() => async function addEmployeeFlow({ flow, self }) {
	if(flow.isLoaded){
		return
	}
    
	try {
		flow.start();

		const list = await Api.equipment.getList();

		list.forEach((el) => {
			const item = createEquipment(el);

			if(!self.collection.has(item.id)){
				self.collection.set(item.id, item);
				self.list.push(item.id);
			}
		})

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

export const EquipmentStore = Store.props({ create, remove, fetchList })
