import { ChangeEvent, useState } from 'react';

import { Input } from 'antd';
import { useSearchParams } from 'react-router-dom';

import { SEARCH_PARAMS } from '~/constants';

import { s } from './search.styles';

interface ISearchProps {
    onSearch: (value:string) => void;
}

export function Search({ onSearch }:ISearchProps) {
	const [searchParams, setSearchParams] = useSearchParams();

	const [searchBy, setSearchBy] = useState(searchParams.get(SEARCH_PARAMS.SEARCH_BY) ?? "");

	const onChangeSearch = (text: string) => {
		onSearch(text);
		
		const newSearchParams = new URLSearchParams(searchParams);

		if(text){
			newSearchParams.set(SEARCH_PARAMS.SEARCH_BY, text)
		} else {
			newSearchParams.delete(SEARCH_PARAMS.SEARCH_BY);
		}

		setSearchParams(newSearchParams);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchBy(e.target.value);
	};

	return (
		<Input.Search
			css={s.search}
			data-testid="searchInput"
			placeholder="Пошук"
			allowClear
			value={searchBy}
			onSearch={onChangeSearch}
			onChange={onChange}
		/>
	);
}