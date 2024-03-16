import { ChangeEvent } from 'react';

import { Input } from 'antd';

import { s } from './search.styles';

interface ISearchProps {
    onSearch: (value:string) => void;
	onChangeValue: (value:string) => void;
	value?: string;
}

export function Search({ onSearch, onChangeValue, value }:ISearchProps) {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChangeValue?.(e.target.value);
	};

	return (
		<Input.Search
			css={s.search}
			data-testid="searchInput"
			placeholder="Пошук"
			allowClear
			value={value}
			onSearch={onSearch}
			onChange={onChange}
		/>
	);
}