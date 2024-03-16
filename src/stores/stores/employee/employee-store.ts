import { Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Api, IEmployeeDTO } from '~/api'
import { EMPLOYEE_TYPE } from '~/constants';
import { ranksData } from '~/data'
import { CreateValue } from '~/types'
import { dates } from '~/utils';

import { types } from '../../types'
import { asyncAction , createCollection, createList, safeReference } from '../../utils';
import { Rank, IRank, IRankValue, Employee, IEmployee, IEmployeeValue, createEmployee, createEmployeeDTO,  createRank } from './entities';

const Store = types
	.model('EmployeeStore', {
		ranksCollection: createCollection<IRank, IRankValue>("Ranks", Rank),
		ranksList: createList<IRank>("RanksList", safeReference(Rank), { pageSize: 100 }),

		collection: createCollection<IEmployee, IEmployeeValue>("Employees", Employee),
		list: createList<IEmployee>("EmployeesList", safeReference(Employee), { pageSize: 10 })
	})
	.actions((self) => ({
		init() {
			ranksData.forEach(data => {
				self.ranksCollection.set(data.id, createRank(data))
				self.ranksList.push(data.id);
			})
		},
		push: (res: IEmployeeDTO[]) => {
			self.list.checkMore(res.length);
			res.forEach((el) => {
				const value = createEmployee(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
			})
		},
		set(res: IEmployeeDTO[]){
			self.list.checkMore(res.length);
			self.list.clear();

			res.forEach((el) => {
				const value = createEmployee(el);

				self.collection.set(value.id, value);
				self.list.push(value.id);
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

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IEmployeeValue>) => async function fn({ flow, self }) {
	try {
		flow.start();
		const res = await Api.employee.create(createEmployeeDTO(data));
		const employee = createEmployee(res);

		self.collection.set(employee.id, employee);
		self.list.push(employee.id);
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
		await Api.employee.remove(id);
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

		const res = await Api.employee.getList({
			search,
			limit: self.list.pageSize,
		});

		self.set(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

const fetchListMore = asyncAction<Instance<typeof Store>>((search: string) => async function fn({ flow, self }) {    
	try {
		if(!self.list.isMorePages) return;

		flow.start();

		const res = await Api.employee.getList({
			search,
			limit: self.list.pageSize,
			startAfter: dates.toDateServer(self.list.last.createdAt),
		});

		self.push(res);
		
		flow.success();
	} catch (err) {
		flow.failed(err as Error);
	}
});

export const EmployeeStore = Store.props({ create, remove, fetchList, fetchListMore })
