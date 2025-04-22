import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { type IBook } from 'shared-my-client';

import { Icon, List, ListHeader, Image } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const ListItem = observer(({ item }: { item: IBook }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.BOOK_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
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

export const BooksListPage = observer(() => {
    const { book } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.BOOK_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

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
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={item => <ListItem item={item} />}
        />
    );
});
