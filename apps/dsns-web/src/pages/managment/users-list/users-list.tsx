import React from 'react';

import { Button, Typography, Space, Tag } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { ROLES } from 'shared-my';
import { dates, useAsyncEffect } from 'shared-my-client';
import { type IUser } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './users-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item, organizationId }: { item: IUser; organizationId: string }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { organizationId, id: item?.id, mode: WIZARD_MODE.VIEW });
    };

    const roles = [
        item.hasRole(ROLES.ROOT_ADMIN) ? 'Головний Адмін' : undefined,
        item.hasRole(ROLES.ORGANIZATION_ADMIN) ? 'Адмін організації' : undefined,
        item.hasRole(ROLES.AMMO_CONTENT_ADMIN) ? 'Адмін Контенту' : undefined,
        item.hasRole(ROLES.DEMINING_VIEWER) ? 'Demining' : undefined,
        item.hasRole(ROLES.AMMO_VIEWER) ? 'Ammo' : undefined,
    ].filter(Boolean);

    return (
        <List.Item key={item.id} actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.UserOutlined />}
                title={item.displayName ?? 'anonim'}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{dates.format(item.data.createdAt, 'YYYY-MM-DD HH:mm')}</Text>
                    </Space>
                }
            />
            {roles.map(role => (
                <Tag key={role}>{role}</Tag>
            ))}
        </List.Item>
    );
});

export const UsersListPage = observer(() => {
    const { user, viewer } = useStore();
    const title = useRouteTitle();
    const { organizationId } = useParams<'organizationId'>();
    const search = useSearch();

    const id = organizationId ?? viewer.user?.data.organization?.id ?? '';

    const onCreate = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { mode: WIZARD_MODE.CREATE, organizationId: id });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        user?.fetchList.run(value);
    };

    const onLoadMore = () => {
        user?.fetchMoreList.run(search.searchValue);
    };

    useAsyncEffect(async () => {
        await user?.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            loading={user?.fetchList.isLoading}
            loadingMore={user?.fetchMoreList.isLoading}
            dataSource={user?.list.asArray}
            isReachedEnd={!user?.list.isMorePages}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={item => <ListItem item={item} organizationId={id ?? ''} />}
        />
    );
});
