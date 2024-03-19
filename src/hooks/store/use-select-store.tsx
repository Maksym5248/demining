import { useEffect, useState } from 'react';

import { useDebounce } from '../common/useDebounce';

interface IAsyncAction {
	run: (search:string) => Promise<void>;
	inProgress: boolean;
}

interface IList<T> {
	asArray: T[];
	isMorePages: boolean;
}

interface IUseSelectStore<T> {
		fetchList: IAsyncAction;
		fetchListMore: IAsyncAction;
		fetchItem: IAsyncAction;
		collection: {
			get: (id: string) => T;
		}
		searchList: IList<T>;
		list: IList<T>;
}

export function useSelectStore<T>(store : IUseSelectStore<T>, defaultValue?: string) {
	const [searchValue, setSearchValue] = useState("");

	const initialItem = store.collection.get(defaultValue ?? "");

	const onSearch = useDebounce((value:string) => {
		setSearchValue(value)
		store.fetchList.run(value);
	}, [])

	const onLoadMore = () => {
		store.fetchListMore.run(searchValue);
	}

	const onFocus = () => {
		store.fetchList.run(searchValue);
	};

	const list = searchValue ? store.searchList :  store.list;

	useEffect(() => {
		if(defaultValue && !initialItem){
			store.fetchItem.run(defaultValue)
		}
	}, [])

	return {
		onSearch,
		loadingInput: store.fetchItem.inProgress,
		loading: store.fetchList.inProgress,
		loadingMore: store.fetchListMore.inProgress,
		isReachedEnd: !list.isMorePages,
		onLoadMore,
		onFocus,
		list: list.asArray,
		initialItem,
	};
}