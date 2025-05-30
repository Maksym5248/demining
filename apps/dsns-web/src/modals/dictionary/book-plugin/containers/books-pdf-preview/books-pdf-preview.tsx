import React, { useEffect } from 'react';

import { observer } from 'mobx-react';

import { List, ListHeader } from '~/components';
import { useStore, useRouteTitle, useSearch } from '~/hooks';

export const BooksPdfPreview = observer(() => {
    const { book } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        book.fetchList.run(value);
    };

    const onLoadMore = () => {
        book.fetchListMore.run(search.searchValue);
    };

    useEffect(() => {
        book.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            rowKey="id"
            itemLayout="horizontal"
            loading={book.fetchList.isLoading}
            loadingMore={book.fetchListMore.isLoading}
            isReachedEnd={!book.list.isMorePages}
            dataSource={book.list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} {...search} />}
        />
    );
});
