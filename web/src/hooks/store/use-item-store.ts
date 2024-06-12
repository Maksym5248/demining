import { useEffect } from 'react';

import { IUseSelectStore } from '~/stores/type';

export function useItemStore<T extends B, B extends { id: string }>(store: IUseSelectStore<T, B>, id: string) {
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
