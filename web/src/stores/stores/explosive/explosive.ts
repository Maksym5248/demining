import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';
import { Dayjs } from 'dayjs';

import { CreateValue } from '~/types'
import { Api, IExplosiveActionSumDTO, IExplosiveDTO } from '~/api'
import { dates } from '~/utils';
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';

import { asyncAction, createCollection, createList, safeReference } from '../../utils';
import { 
	IExplosive,
	IExplosiveValue,
	IExplosiveActionValue,
	IExplosiveAction,
	createExplosive,
	createExplosiveDTO,
	Explosive,
	ExplosiveAction,
	createExplosiveActionSum,
} from './entities';

const SumExplosiveActions = types.model('SumExplosiveObjectActions', {
	explosive: types.number,
	detonator: types.number,
});

const Store = types
	.model('ExplosiveStore', {
		collectionActions: createCollection<IExplosiveAction, IExplosiveActionValue>("ExplosiveActions", ExplosiveAction),
		collection: createCollection<IExplosive, IExplosiveValue>("Explosives", Explosive),
		list: createList<IExplosive>("ExplosivesList", safeReference(Explosive), { pageSize: 10 }),
		searchList: createList<IExplosive>("ExplosivesSearchList", safeReference(Explosive), { pageSize: 10 }),
		sum: types.optional(SumExplosiveActions, {
			explosive: 0,
			detonator: 0,
		}),
	}).actions(self => ({
		setSum(sum: IExplosiveActionSumDTO){
			self.sum = createExplosiveActionSum(sum);
		},
		append(res: IExplosiveDTO[], isSearch: boolean, isMore?:boolean){
			const list = isSearch ? self.searchList : self.list;
			if(isSearch && !isMore) self.searchList.clear();

			list.checkMore(res.length);

			res.forEach((el) => {
				const value = createExplosive(el);

				self.collection.set(value.id, value);
				if(!list.includes(value.id)) list.push(value.id);
			})
		},
	})).views((self) => ({
		get explosiveList(){
			return self.list.asArray.filter(el => el.type === EXPLOSIVE_TYPE.EXPLOSIVE);
		},
		get detonatorList(){
			return self.list.asArray.filter(el => el.type === EXPLOSIVE_TYPE.DETONATOR);
		},
	}));

const create = asyncAction<Instance<typeof Store>>((data: CreateValue<IExplosiveValue>) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.explosive.create(createExplosiveDTO(data));
		const value = createExplosive(res);

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
		await Api.explosive.remove(id);
		self.list.removeById(id);
		self.collection.remove(id);
		flow.success();
		message.success('Видалено успішно');
	} catch (err) {
		flow.failed(err as Error);
		message.error('Не вдалось видалити');
	}
});

const fetchList = asyncAction<Instance<typeof Store>>((search: string) => async function addFlow({ flow, self }) {
	try {
		const isSearch = !!search;
		const list = isSearch ? self.searchList : self.list

		if(!isSearch && list.length) return;

		flow.start();

		const res = await Api.explosive.getList({
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

		const res = await Api.explosive.getList({
			search,
			limit: list.pageSize,
			startAfter: dates.toDateServer(list.last.createdAt),
		});

		self.append(res, isSearch, true);


		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchItem = asyncAction<Instance<typeof Store>>((id:string) => async function fn({ flow, self }) {    
	try {
		flow.start();
		const res = await Api.explosive.get(id);

		self.collection.set(res.id, createExplosive(res));

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

const fetchSum = asyncAction<Instance<typeof Store>>((startDate: Dayjs, endDate:Dayjs) => async function addFlow({ flow, self }) {
	try {
		flow.start();

		const res = await Api.explosive.sum({
			where: {
				executedAt: {
					">=": dates.toDateServer(startDate),
					"<=": dates.toDateServer(endDate),
				},
			}
		});

		self.setSum(res);

		flow.success();
	} catch (err) {
		flow.failed(err as Error);
		message.error('Виникла помилка');
	}
});

export const ExplosiveStore = Store.props({
	create,
	remove, 
	fetchList,
	fetchListMore,
	fetchItem,
	fetchSum,
})
