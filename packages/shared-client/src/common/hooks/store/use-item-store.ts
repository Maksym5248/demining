import { useEffect } from 'react';

import { type IUseSelectStore } from '../../types';

export function useItemStore<T extends { data: B }, B extends { id: string }>(store: IUseSelectStore<T, B>, id: string) {
    const item = store.collection.get(id);

    useEffect(() => {
        if (!item && id) {
            store.fetchItem.run(id);
            store.fetchItemDeeps?.run(id);
        }
    }, []);

    return {
        item,
        isLoading: store.fetchList.isLoading || !!store.fetchItemDeeps?.isLoading,
    };
}
