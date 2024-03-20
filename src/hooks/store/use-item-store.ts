import { useEffect } from "react";

import { IUseSelectStore } from "~/types/store";

export function useItemStore<T>(store: IUseSelectStore<T>,id: string) {
	const item = store.collection.get(id as string);

	useEffect(() => {
		if(!item){
			store.fetchItem.run(id);
		}
	}, []);

	return {
		item,
		isLoading: store.fetchList.inProgress
	}
}