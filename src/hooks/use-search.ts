import { useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { SEARCH_PARAMS } from '~/constants';


export const useSearch = (initialValue?: string) =>  {
	const [searchParams, setSearchParams] = useSearchParams();

	const [searchBy, setSearchBy] = useState(searchParams.get(SEARCH_PARAMS.SEARCH_BY) ?? initialValue ?? "");
	const [searchValue, setSearchValue] = useState(searchBy);

	const onChangeSearch = (text: string) => {		
		const newSearchParams = new URLSearchParams(searchParams);

		if(text){
			newSearchParams.set(SEARCH_PARAMS.SEARCH_BY, text)
		} else {
			newSearchParams.delete(SEARCH_PARAMS.SEARCH_BY);
		}

		setSearchValue(text);
		setSearchParams(newSearchParams);
	};

	return {
		searchBy,
		setSearchBy,
		searchValue,
		updateSearchParams: onChangeSearch
	}
}