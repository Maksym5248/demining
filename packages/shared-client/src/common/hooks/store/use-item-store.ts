import { useEffect } from 'react';

import { type IData, type IDataModel } from '~/models';

import { type IUseSelectStore } from '../../types';

export function useItemStore<T extends IDataModel<B>, B extends IData>(store: IUseSelectStore<T, B>, id: string) {
    const item = store.collection.get(id);

    useEffect(() => {
        if (!item && id) {
            store.fetchItem.run(id);
        }
    }, []);

    return {
        item,
        isLoading: store.fetchList.isLoading,
    };
}
