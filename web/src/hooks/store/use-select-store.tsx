import { useEffect, useState } from 'react';

import { IUseSelectStore } from '~/types/store';

import { useDebounce } from '../common/useDebounce';

export function useSelectStore<T>(store: IUseSelectStore<T>, defaultValue?: string) {
    const [searchValue, setSearchValue] = useState('');

    const initialItem = store.collection.get(defaultValue ?? '');

    const onSearch = useDebounce((value: string) => {
        setSearchValue(value);
        store.fetchList.run(value);
    }, []);

    const onLoadMore = () => {
        store.fetchListMore.run(searchValue);
    };

    const onFocus = () => {
        store.fetchList.run(searchValue);
    };

    const list = searchValue ? store.searchList : store.list;

    useEffect(() => {
        if (defaultValue && !initialItem) {
            store.fetchItem.run(defaultValue);
        }
    }, []);

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
