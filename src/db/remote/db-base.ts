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
	getCountFromServer
} from 'firebase/firestore';
import isArray from 'lodash/isArray';

type IWhere = {[field:string]: any};
type IOrder = {
	by: string,
	type: "asc" | 'desc',
};

export type IQuery = {
	where?: IWhere;
	order?: IOrder;
	limit?: number;
	startAfter?: string | number | Timestamp;
};

const getWhere = (values: IWhere) => 
	 Object.keys(values).map(key => {
		const value = values[key];

		if(value?.in && isArray(value.in)){
			return where(key, "in", value.in) 
		}
		
		return where(key, "==", value)
	});

const getOrder = (value: IOrder) => orderBy(value.by, value.type);

export class DBBase<T extends {id: string, createdAt: Timestamp, updatedAt: Timestamp}> {
	tableName: string;

	rootCollection?: string;

	batch: WriteBatch | null = null;

	constructor(tableName: string){
		this.tableName = tableName;
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

	async select(args?: Partial<IQuery> ): Promise<T[]> {
		console.log("select", args)

		const q = query(this.collection,
			 ...(args?.where ? getWhere(args.where) : []),
			 ...(args?.order ? [getOrder(args?.order)] : []),
			 ...(args?.startAfter ? [startAfter(args?.startAfter)] : []),
			 ...(args?.limit ? [limit(args?.limit)] : []),
		);

		console.log("select 2",  q)

		const snapshot = await getDocs(q);

		const data = snapshot.docs.map(d => d.data()) as (T & {
			createdAt: Timestamp,
			updatedAt: Timestamp,
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
		};
		
		return data
	}

	async exist(field:keyof T, value: any):Promise<boolean> {
		const q = query(this.collection, where(String(field), "==", value));

		const querySnapshot = await getDocs(q);		  

		return !querySnapshot.empty
	}

	private getCreateValue(value: Omit<T, "createdAt" | "updatedAt" | "id"> & Partial<Pick<T, "id">>) {
		const id = value?.id ?? (this.uuid());
		const ref = doc(this.collection, id);
		const timestamp = serverTimestamp();
	
		const newValue = {
			...value,
			id,
			createdAt: timestamp,
			updatedAt: timestamp
		} as T & {
				createdAt: Timestamp,
				updatedAt: Timestamp,
			};
	
		return { ref, newValue }
	}

	private getUpdateValue(id:string, value: Partial<T>) {
		const newValue = {...value};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.id) delete newValue.id;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.updatedAt) delete newValue.updatedAt;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if(newValue?.createdAt) delete newValue.createdAt;

		const ref = doc(this.collection, id);
		const timestamp = serverTimestamp();

		const updatedValue = {
			...newValue,
			updatedAt: timestamp
		} as UpdateData<T>

		return { ref, newValue: updatedValue};
	}

	async create(value: Omit<T, "createdAt" | "updatedAt" | "id"> & Partial<Pick<T, "id">>): Promise<T>{
		const { ref, newValue } = this.getCreateValue(value)

		await setDoc(ref, newValue);
		const res = await this.get(newValue.id) as T;
		return res
	}

	batchCreate(value: Omit<T, "createdAt" | "updatedAt" | "id"> & Partial<Pick<T, "id">>) {
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

	async count(){
		const snapshot = await getCountFromServer(this.collection);
		
		return snapshot.data().count
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