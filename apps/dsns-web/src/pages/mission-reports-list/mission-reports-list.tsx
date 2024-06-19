import React, { useEffect } from 'react';

import { str } from '@/shared/common';
import { type IMissionReport } from '@/shared-client/stores';
import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { WIZARD_MODE, MODALS } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './mission-reports-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IMissionReport }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MISSION_REPORT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={item.number}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{str.toUpperFirst(item.address)}</Text>
                        <Text type="secondary">{item.executedAt.format('DD.MM.YYYY')}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const MissionReportsListPage = observer(() => {
    const title = useRouteTitle();

    const { missionReport } = useStore();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.MISSION_REPORT_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        missionReport.fetchList.run(value);
    };

    const onLoadMore = () => {
        missionReport.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        missionReport.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? missionReport.searchList : missionReport.list;

    return (
        <List
            loading={missionReport.fetchList.isLoading}
            loadingMore={missionReport.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            style={{ flex: 1 }}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
