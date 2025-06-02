import { useState } from 'react';

import { SEARCH_PARAMS } from '~/constants';

export const useSearch = (initialValue?: string) => {
    // Use window.location and URLSearchParams directly instead of useSearchParams
    const getCurrentSearchBy = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get(SEARCH_PARAMS.SEARCH_BY) ?? initialValue ?? '';
        }
        return initialValue ?? '';
    };

    const [searchBy, setSearchBy] = useState(getCurrentSearchBy());
    const [searchValue, setSearchValue] = useState(searchBy);

    const onChangeSearch = (text: string) => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (text) {
                params.set(SEARCH_PARAMS.SEARCH_BY, text);
            } else {
                params.delete(SEARCH_PARAMS.SEARCH_BY);
            }
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        }
        setSearchValue(text);
        setSearchBy(text);
    };

    return {
        searchBy,
        setSearchBy,
        searchValue,
        updateSearchParams: onChangeSearch,
    };
};
