import { useEffect } from 'react';

import { IUseSelectStore } from '~/types/store';

export function useItemStore<T>(store: IUseSelectStore<T>, id: string) {
    const item = store.collection.get(id);

    useEffect(() => {
        if (!item && id) {
            store.fetchItem.run(id);
        }
    }, []);

    return {
        item,
        isLoading: store.fetchList.inProgress,
    };
}
