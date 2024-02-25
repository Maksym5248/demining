import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IEmployeeDTO } from '~/api'
import { EMPLOYEE_TYPE } from '~/constants'
import { CreateValue } from '~/types'

import { types } from '../../types'
import { asyncAction , createCollection, createList, safeReference } from '../../utils';
import { Rank, IRank, IRankValue, Employee, IEmployee, IEmployeeValue, createEmployee, createEmployeeDTO,  createRank } from './entities';
import { ranksData } from './ranks-data'

const Store = types
	.model('EmployeeStore', {
		ranksCollection: createCollection<IRank, IRankValue>("Ranks", Rank),
		ranksList: createList<IRank>("RanksList", safeReference(Rank), { pageSize: 20 }),

		collection: createCollection<IEmployee, IEmployeeValue>("Employees", Employee),
		list: createList<IEmployee>("EmployeesList", safeReference(Employee), { pageSize: 20 })
	})
	.actions((self) => ({
		init() {
			ranksData.forEach(data => {
				self.ranksCollection.set(data.id, createRank(data))
				self.ranksList.push(data.id);
			})
		},
		push: (values: IEmployeeDTO[]) => {
			values.forEach((el) => {
				const employee = createEmployee(el);

				if(!self.collection.has(employee.id)){
					self.collection.set(employee.id, employee);
					self.list.push(employee.id);
				}
			})
		}
	})).views((self) => ({
		get employeesListChief(){
			return self.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.CHIEF)
		},
		get squadLeads(){
			return self.list.asArray.filter((el) => el.type === EMPLOYEE_TYPE.SQUAD_LEAD)
		},
		get workers(){
			return self.list.asArray.filter((el) => el.type !== EMPLOYEE_TYPE.CHIEF)
		},
		getById(id:string){
			return self.collection.get(id as string);
		}
	})).views((self) => ({
		get employeesChiefFirst(){
			return self.employeesListChief[0];
		},
		get employeesSquadLeadFirst(){
			return self.squadLeads[0];
		},
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IEmployeeValue>) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		const res = await Api.employee.create(createEmployeeDTO(data));
		const employee = createEmployee(res);

		self.collection.set(employee.id, employee);
		self.list.push(employee.id);
		flow.success();
		message.success('Додано успішно');
	} catch (err) {
		message.error('Не вдалось додати');
	}
});

const remove = asyncAction<Instance<typeof Store>>((id:string) => async function addEmployeeFlow({ flow, self }) {
	try {
		flow.start();
		await Api.employee.remove(id);
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

		const res = await Api.employee.getList();

		self.push(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

export const EmployeeStore = Store.props({ create, remove, fetchList })
