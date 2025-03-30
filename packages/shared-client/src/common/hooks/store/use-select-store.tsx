import { useEffect, useState } from 'react';

import { type IData, type IDataModel } from '~/models';

import { type IUseSelectStore } from '../../types';
import { useDebounce } from '../common/use-debounce';

export function useSelectStore<T extends IDataModel<B>, B extends IData>(store: IUseSelectStore<T, B>, defaultValue?: string) {
    const [searchValue, setSearchValue] = useState('');

    const initialItem = store.collection.get(defaultValue ?? '');

    const onSearch = useDebounce((value: string) => {
        setSearchValue(value);
        store.fetchList.run(value);
    }, []);

    const onLoadMore = () => {
        store?.fetchMoreList?.run(searchValue);
    };

    const onFocus = () => {
        store.fetchList.run(searchValue);
    };

    useEffect(() => {
        if (defaultValue && !initialItem) {
            store.fetchItem.run(defaultValue);
        }
    }, []);

    return {
        onSearch,
        loadingInput: store.fetchItem.isLoading,
        loading: store.fetchList.isLoading,
        loadingMore: !!store?.fetchMoreList?.isLoading,
        isReachedEnd: !store.list.isMorePages,
        onLoadMore,
        onFocus,
        list: store.list.asArray,
        initialItem,
    };
}
