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
	orderBy
} from 'firebase/firestore';

type IWhere = {[field:string]: string};
type IOrder = {
	by: string,
	type: "asc" | 'desc',
};

type IQuery = {
	where: IWhere,
	order: IOrder
};

const getWhere = (value: IWhere) => 
	 Object.keys(value).map(key => where(key, "==", value[key]));

const getOrder = (value: IOrder) => orderBy(value.by, value.type);

export class DBBase<T extends {id: string, createdAt: Date, updatedAt: Date}> {
	tableName: string;

	constructor(tableName: string){
		this.tableName = tableName;
	}

	get collection(){
		return collection(getFirestore(), this.tableName) as CollectionReference<T>
	}

	async uuid(){
		const newDocumentRef = doc(this.collection);
		return  newDocumentRef.id;
	}

	async select(args?: Partial<IQuery> ): Promise<T[]> {
		const q = query(this.collection,
			 ...(args?.where ? getWhere(args.where) : []),
			 ...(args?.order ? [getOrder(args?.order)] : [])
		);

		const userSnapshot = await getDocs(q);

		const data = userSnapshot.docs.map(d => d.data()) as (T &{
			createdAt: Timestamp,
			updatedAt: Timestamp,
		})[];

		return data.map((el) => ({
			...el,
			createdAt: el?.createdAt?.toDate(),
			updatedAt: el?.updatedAt?.toDate()
		})) as T[]
	}

	async get(id:string):Promise<T | null> {
		const ref = doc(this.collection, id);

		const res = await getDoc(ref);
	
		let data:T & {
			createdAt: Timestamp,
			updatedAt: Timestamp,
		} | null = null;
	
		if(res.exists()){
			data = res.data() as T & {
				createdAt: Timestamp,
				updatedAt: Timestamp,
			};
		}
	
		return data ? {
			...data,
			createdAt: data?.createdAt?.toDate(),
			updatedAt: data?.updatedAt?.toDate()
		} : null
	}

	async exist(field:keyof T, value: any):Promise<boolean> {
		const q = query(this.collection, where(String(field), "==", value));

		const querySnapshot = await getDocs(q);		  

		return !querySnapshot.empty
	}

	async create(value: Omit<T, "createdAt" | "updatedAt">): Promise<T>{
		const id = value?.id ?? (await this.uuid());
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

		await setDoc(ref, newValue);
	
		return {
			...newValue,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as T
	}

	async initData(): Promise<T[]>{
		return []
	}

	async update(id:string, value: Partial<T>): Promise<T> {
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

		await updateDoc(ref, {
			...newValue,
			updatedAt: timestamp
		} as UpdateData<T>);

		const res = await this.get(id) as T;

		return res;
	}

	async remove(id:string) {
		const ref = doc(this.collection, id);
		await deleteDoc(ref)
		return id;
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