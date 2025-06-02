import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader, Image } from '~/components';
import { useStore, useSearch } from '~/hooks';

import { type IBooksListItemProps, type IBooksListProps } from './books-list.types';

const ListItem = observer(({ item, onOpenBook }: IBooksListItemProps) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onOpenBook(item.id);
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                title={item?.displayName}
                description={item.types
                    ?.map(type => type.name)
                    .filter(Boolean)
                    .join(', ')}
                avatar={<Image src={item.data.imageUri} width={70} />}
            />
        </List.Item>
    );
});

export const BooksList = observer(({ onOpenBook }: IBooksListProps) => {
    const { book } = useStore();
    const search = useSearch();

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        book.fetchList.run(value);
    };

    const onLoadMore = () => {
        book.fetchListMore.run(search.searchValue);
    };

    useEffect(() => {
        book.fetchList.run(search?.searchValue);
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
            header={<ListHeader onSearch={onSearch} {...search} />}
            renderItem={item => <ListItem item={item} onOpenBook={onOpenBook} />}
        />
    );
});
