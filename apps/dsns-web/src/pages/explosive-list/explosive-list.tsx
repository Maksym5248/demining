import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { EXPLOSIVE_TYPE, MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { type IExplosive } from '~/stores/explosive';

import { s } from './explosive-list.styles';

const { Text } = Typography;

const types = {
    [EXPLOSIVE_TYPE.EXPLOSIVE]: 'Вибухові речовини',
    [EXPLOSIVE_TYPE.DETONATOR]: 'Засоб підриву',
};

const ListItem = observer(({ item }: { item: IExplosive }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={item.name}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{types[item.type]}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const ExplosiveListPage = observer(() => {
    const { explosive } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        explosive.fetchList.run(value);
    };

    const onLoadMore = () => {
        explosive.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        explosive.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? explosive.searchList : explosive.list;

    return (
        <List
            loading={explosive.fetchList.isLoading}
            loadingMore={explosive.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});