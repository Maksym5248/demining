import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { TRANSPORT_TYPE } from 'shared-my';
import { type ITransport } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './transport-list.styles';

const { Text } = Typography;

const types = {
    [TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS]: 'ВНП',
    [TRANSPORT_TYPE.FOR_HUMANS]: 'о/с',
};

const ListItem = observer(({ item }: { item: ITransport }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.TRANSPORT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={item.data.name}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{types[item.data.type]}</Text>
                        <Text type="secondary">{item.data.number}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const TransportListPage = observer(() => {
    const { transport } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.TRANSPORT_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        transport.fetchList.run(value);
    };

    const onLoadMore = () => {
        transport.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        transport.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            loading={transport.fetchList.isLoading}
            loadingMore={transport.fetchMoreList.isLoading}
            isReachedEnd={!transport.list.isMorePages}
            dataSource={transport.list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={item => <ListItem item={item} />}
        />
    );
});
