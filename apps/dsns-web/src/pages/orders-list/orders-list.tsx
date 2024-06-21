import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { type IOrder } from 'shared-my-client/stores';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './orders-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IOrder }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.ORDER_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={`№${item.number}`}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{item.signedAt.format('DD/MM/YYYY')}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const OrdersListPage = observer(() => {
    const { order } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.ORDER_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        order.fetchList.run(value);
    };

    const onLoadMore = () => {
        order.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        order.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? order.searchList : order.list;

    return (
        <List
            loading={order.fetchList.isLoading}
            loadingMore={order.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
