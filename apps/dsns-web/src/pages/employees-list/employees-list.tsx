import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { str } from 'shared-my';
import { type IEmployee } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './employees-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IEmployee }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EMPLOYEES_WIZARD, { id: item.data.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item key={item.data.id} actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.UserOutlined />}
                title={str.getFullName(item.data)}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{str.toUpperFirst(item?.rank?.data.fullName ?? '')}</Text>
                        <Text type="secondary">{str.toUpperFirst(item.data.position)}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const EmployeesListPage = observer(() => {
    const { employee } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        employee.fetchList.run(value);
    };

    const onLoadMore = () => {
        employee.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        employee.fetchList.run(search.searchValue);
    }, []);

    const list = search.searchValue ? employee.searchList : employee.list;

    return (
        <List
            loading={employee.fetchList.isLoading}
            loadingMore={employee.fetchMoreList.isLoading}
            isReachedEnd={!list.isMorePages}
            dataSource={list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
