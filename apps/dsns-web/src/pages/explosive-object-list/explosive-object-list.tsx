import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { IExplosiveObject } from '~/stores';

import { s } from './explosive-object-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IExplosiveObject }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                title={item?.fullDisplayName}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{item?.type?.fullName}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const ExplosiveObjectListPage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        explosiveObject.fetchList.run(value);
    };

    const onLoadMore = () => {
        explosiveObject.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        explosiveObject.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? explosiveObject.searchList : explosiveObject.list;

    return (
        <List
            loading={explosiveObject.fetchList.isLoading}
            loadingMore={explosiveObject.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
