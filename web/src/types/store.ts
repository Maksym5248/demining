
export interface IAsyncAction {
	run: (search:string) => Promise<void>;
	inProgress: boolean;
}

export interface IList<T> {
	asArray: T[];
	isMorePages: boolean;
}

export interface IUseSelectStore<T> {
		fetchList: IAsyncAction;
		fetchListMore: IAsyncAction;
		fetchItem: IAsyncAction;
		collection: {
			get: (id: string) => T;
		}
		searchList: IList<T>;
		list: IList<T>;
}