import { 
	getFirestore, 
	collection, 
	CollectionReference,
	doc, 
	getDoc, 
	query, 
	where,
	deleteDoc,
	getDocs, 
	setDoc,
	serverTimestamp,
	Timestamp, 
	updateDoc, 
	UpdateData,
	orderBy,
	limit,
	WriteBatch,
	startAfter,
	getCountFromServer,
	getAggregateFromServer,
	sum,
	QueryFieldFilterConstraint,
	startAt,
	endAt
} from 'firebase/firestore';
import { isObject } from 'lodash';
import isArray from 'lodash/isArray';

import { IBaseDB } from '../types';

type IWhere = {[field:string]: any};
type IOrder = {
	by: string,
	type?: "asc" | 'desc',
};

export type IQuery = {
	search?: string;
	where?: IWhere;
	order?: IOrder;
	limit?: number;
	startAfter?: string | number | Timestamp;
	startAt?: string | number | Timestamp;
	endAt?: string | number | Timestamp;
};

function generateValueStartsWith(value: string): string[] {
	const prefixes: string[] = [];
	const arr = value.toLowerCase().split(/\s+/);

	arr.forEach(v => {
		for (let i = 1; i <= v.length; i+=1) {
			prefixes.push(v.substring(0, i));
		}
	});

	return prefixes;
}

const getWhere = (values: IWhere) => {
	const res:QueryFieldFilterConstraint[] = [];

	Object.keys(values).forEach(key => {
		const value = values[key];

		if(value?.in && isArray(value.in)){
			res.push(where(key, "in", value.in) )
		}

		if(value?.[">="]){
			res.push(where(key, ">=", value['>=']))
		}

		if(value?.["<="]){
			res.push(where(key, "<=", value['<=']))
		}

		if(!!value && value["array-contains-any"]){
			res.push(where(key, "array-contains-any", value["array-contains-any"]))
		}
		
		if(!isObject(value) && !isArray(value)) {
			res.push(where(key, "==", value))
		};
	});

	return res;
};

const getOrder = (value: IOrder) => orderBy(value.by, value.type);

type CreateData<T extends IBaseDB> = Omit<T, "createdAt" | "updatedAt" | "authorId" | "id" | "geo"> & Partial<Pick<T, "id">>;

export class DBBase<T extends IBaseDB> {
	tableName: string;

	rootCollection?: string;

	batch: WriteBatch | null = null;

	searchFields: (keyof T)[];

	getCreateData: ((value: Omit<T, "createdAt" | "updatedAt" | "authorId" | "id" | "geo">) => Partial<T>) | undefined = undefined;
	
	getUpdateData: ((value: Partial<T>) => Partial<T>) | undefined = undefined;

	constructor(
		tableName: string,
		searchFields: (keyof T)[],
		getCreateData?: (value: Omit<T, "createdAt" | "updatedAt" | "authorId" | "id" | "geo">) => Partial<T>,
		getUpdateData?: (value: Partial<T>) => Partial<T>
	){
		this.tableName = tableName;
		this.searchFields = searchFields ?? [];
		this.getCreateData = getCreateData;
		this.getUpdateData = getUpdateData;
	}

	setRootCollection(rootCollection: string){
		this.rootCollection = rootCollection;
	}

	removeRootCollection(){
		this.rootCollection = undefined;
	}

	setBatch(batch: WriteBatch | null){
		this.batch = batch;
	}

	get collection(){
		const name = this.rootCollection ? `${this.rootCollection}/${this.tableName}` : this.tableName;
		return collection(getFirestore(), name) as CollectionReference<T>
	}

	uuid(){
		const newDocumentRef = doc(this.collection);
		return newDocumentRef.id;
	}
	
	query(args?: Partial<IQuery>){
		return query(this.collection,
			...(args?.search ? getWhere(this.createSearchWhere(args?.search)) : []),
			...(args?.where ? getWhere(args.where) : []),
			...(args?.order ? [getOrder(args?.order)] : []),
			...(args?.startAfter ? [startAfter(args?.startAfter)] : []),
			...(args?.startAt ? [startAt(args?.startAt)] : []),
			...(args?.endAt ? [endAt(args?.endAt)] : []),
			...(args?.limit ? [limit(args?.limit)] : []),
	   );
	}

	async select(args?: Partial<IQuery>): Promise<T[]> {
		const q = this.query(args);

		const snapshot = await getDocs(q);

		const data = snapshot.docs.map(d => {
			// @ts-expect-error
			const { _search, ...newData } = d.data();
			return newData
		}) as (T & {
			createdAt: Timestamp,
			updatedAt: Timestamp,
			_search: Record<keyof T, string>
		})[];

		return data as T[]
	}

	async get(id:string):Promise<T | null> {
		const ref = doc(this.collection, id);

		const res = await getDoc(ref);

		if(!res) return null;
		if(!res?.exists()) return null;

		const data = res.data() as T & {
				createdAt: Timestamp,
				updatedAt: Timestamp,
				_search: Record<keyof T, string>
		};

		// @ts-expect-error
		if(data?._search) delete data._search;
		
		return data
	}

	async exist(field:keyof T, value: any):Promise<boolean> {
		const q = query(this.collection, where(String(field), "==", value));

		const querySnapshot = await getDocs(q);		  

		return !querySnapshot.empty
	}

	private createSearchField(value:Partial<T>){
		const _search: string[] = [];

		this.searchFields.forEach((field) => {
			const arr = generateValueStartsWith(String(value[field] ?? ""));
			_search.push(...arr);
		});

		return { _search }
	}

	private createSearchWhere(search:string){
		const searchLower = String(search ?? "").toLowerCase().split(/\s+/);

		const _search = {
			"array-contains-any": searchLower
		};

		return { _search }
	}

	private getCreateValue(value: CreateData<T>) {
		const id = value?.id ?? (this.uuid());
		const ref = doc(this.collection, id);
		const timestamp = serverTimestamp();
		const search = this.createSearchField(value as T);

		const createData = this.getCreateData ? this.getCreateData(value) : {};
	
		const newValue = {
			...search,
			...value,
			id,
			...createData,
			createdAt: timestamp,
			updatedAt: timestamp,
		} as T & {
				createdAt: Timestamp,
				updatedAt: Timestamp,
				_search: string[]
			};
	
		return { ref, newValue }
	}

	private getUpdateValue(id:string, value: Partial<T>) {
		const newValue = {...value};
		const search = this.createSearchField(value as T);

		if(newValue?.id) delete newValue.id;
		if(newValue?.updatedAt) delete newValue.updatedAt;
		if(newValue?.createdAt) delete newValue.createdAt;

		const ref = doc(this.collection, id);
		const timestamp = serverTimestamp();

		const updateData = this.getUpdateData ? this.getUpdateData(value) : {};

		const updatedValue = {
			...search,
			...newValue,
			...updateData,
			updatedAt: timestamp
		} as UpdateData<T>

		return { ref, newValue: updatedValue};
	}

	async create(value: CreateData<T>): Promise<T>{
		const { ref, newValue } = this.getCreateValue(value)

		await setDoc(ref, newValue);
		const res = await this.get(newValue.id) as T;
		return res
	}

	batchCreate(value: CreateData<T>) {
		const { ref, newValue } = this.getCreateValue(value)
		this.batch?.set(ref, newValue);
	}

	async update(id:string, value: Partial<T>): Promise<T> {
		const { ref, newValue } = this.getUpdateValue(id, value);
		await updateDoc(ref, newValue);
		const res = await this.get(id) as T;
		return res;
	}

	batchUpdate(id:string, value: Partial<T>) {
		const { ref, newValue } = this.getUpdateValue(id, value)
		this.batch?.update(ref, newValue);
	}

	async remove(id:string) {
		const ref = doc(this.collection, id);
		await deleteDoc(ref)
		return id;
	}

	batchRemove(id:string) {
		const ref = doc(this.collection, id);
		this.batch?.delete(ref);
	}

	async count(args?: Partial<IQuery>){
		const q = this.query(args);

		const snapshot = await getCountFromServer(q);
		
		return snapshot.data().count
	}

	async sum(field: keyof T, args?: Partial<IQuery>){
		const q = this.query(args);

		const snapshot = await getAggregateFromServer(q, {
			sum: sum(field as string)
		});
		
		return snapshot.data().sum;
	}

	async removeBy(args: IWhere) {
		const q = query(this.collection, ...getWhere(args));

		const querySnapshot = await getDocs(q);
		const deletePromises: Promise<any>[] = [];
	  
		querySnapshot.forEach((d) => {
		  deletePromises.push(deleteDoc(d.ref));
		});
	  
		await Promise.all(deletePromises);
	}


}