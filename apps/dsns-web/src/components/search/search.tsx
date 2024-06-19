import { type ChangeEvent, useEffect } from 'react';

import { useDebounce, useValues } from '@/shared-client/common';
import { Input } from 'antd';

import { s } from './search.styles';

interface ISearchProps {
    onSearch: (value: string) => void;
    onChangeValue: (value: string) => void;
    value?: string;
}

export function Search({ onSearch, onChangeValue, value }: ISearchProps) {
    const values = useValues();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChangeValue?.(e.target.value);
    };

    const handleSearch = useDebounce(onSearch, []);

    useEffect(() => {
        if (values.get('isLoaded')) {
            handleSearch?.(value);
        }

        values.set('isLoaded', true);
    }, [value]);

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
