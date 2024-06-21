import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { type IMissionRequest } from 'shared-my-client/stores';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './mission-request-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IMissionRequest }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MISSION_REQUEST_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={`№${item.number}`}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{item.displayType}</Text>
                        <Text type="secondary">{item.signedAt.format('DD/MM/YYYY')}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const MissionRequestListPage = observer(() => {
    const { missionRequest } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.MISSION_REQUEST_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        missionRequest.fetchList.run(value);
    };

    const onLoadMore = () => {
        missionRequest.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        missionRequest.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? missionRequest.searchList : missionRequest.list;

    return (
        <List
            loading={missionRequest.fetchList.isLoading}
            loadingMore={missionRequest.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
