import { Connection, ISelectQuery, IWhereQuery, IWhereQueryOption } from 'jsstore';
import uuid from 'uuid/v4';
import _ from 'lodash';

export class DBBase<T extends {id: string}> {
	db: Connection;

	tableName: string;

	constructor(db: Connection, tableName: string){
		this.db = db;
		this.tableName = tableName;
	}

	async uuid(){
		let id = null;

		while(!id) {
			const testId = `${this.tableName}-${uuid()}`;
            
			// eslint-disable-next-line no-await-in-loop
			const res = await this.db.select({
				from: this.tableName,
				where: {
					id: testId
				}
			});

			if(!res.length){
				id = testId
			}
		}

		return id;

	}

	select(args?: Partial<Omit<ISelectQuery, 'from'>> ): Promise<T[]> {
		const params:ISelectQuery = {
			from: this.tableName,
			...args
		};

		return this.db.select<T>(params);
	}

	async get(id:string):Promise<T> {
		const [res] = await this.db.select<T>({
			from: this.tableName,
			where: {
				id
			}
		});

		if(!res){
			throw new Error("there is no element by id")
		}

		return res
	}

	async exist(field:keyof T, value: any):Promise<boolean> {
		const [res] = await this.db.select({
			from: this.tableName,
			where: {
				[field]: value
			},
			limit: 1
		});

		return !!res
	}

	async add(value: Omit<T, "createdAt" | "updatedAt" | "id">): Promise<T>{
		const id = await this.uuid();

		const res = await this.db.insert<T>({
			into: this.tableName,
			values: [{ ...value, id,
				createdAt: new Date(),
				updatedAt: new Date(),}],
			return: true
		}) as T[]

		return res[0] as T;
	}

	async initData(values: Omit<T, "createdAt" | "updatedAt" | "id">[], checkField: keyof Omit<T, "createdAt" | "updatedAt" | "id">): Promise<T[]>{
		const filteredValues = await Promise.all(values.map((value) => this.exist(checkField, value[checkField])))

		const res = await Promise.all(values
			.filter((value, i) => !filteredValues[i])
			.map(value => this.add(value)));

		// @ts-ignore
		return _.isArray(res) ? res: null;
	}

	async update(id:string, value: Partial<Omit<T, "createdAt" | "updatedAt" | "id">>): Promise<T> {
		const newValue = {...value};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(value?.id) delete value.id;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(value?.updatedAt) delete value.updatedAt;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(value?.createdAt) delete value.createdAt;

		await this.db.update({ in: this.tableName,
			set: { ...newValue, updatedAt: new Date(),},
			where: {
				id
			},
		});

		const res = await this.get(id);

		return res;
	}

	remove(id:string | IWhereQueryOption) {
		return this.db.remove({
			from: this.tableName,
			where: {
				id
			}
		})
	}

	removeBy(where: IWhereQuery) {
		return this.db.remove({
			from: this.tableName,
			where
		})
	}
}