import React from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { ROLES } from 'shared-my';
import { useAsyncEffect } from 'shared-my-client';
import { type IUser } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './members-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item, organizationId }: { item: IUser; organizationId: string }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { organizationId, id: item?.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item key={item.id} actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.UserOutlined />}
                title={item.displayName}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{item.hasRole(ROLES.ORGANIZATION_ADMIN) ? 'Адмін' : ''}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const MembersListPage = observer(() => {
    const { organization, viewer } = useStore();
    const title = useRouteTitle();
    const { organizationId } = useParams<'organizationId'>();
    const search = useSearch();

    const id = organizationId ?? viewer.user?.data.organization?.id ?? '';

    const current = organization.collection.get(id);

    const onCreate = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { mode: WIZARD_MODE.CREATE, organizationId: id });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        current?.fetchListMembers.run(value);
    };

    const onLoadMore = () => {
        current?.fetchMoreListMembers.run(search.searchValue);
    };

    useAsyncEffect(async () => {
        if (!current) {
            await organization.fetchItem.run(id);
        }

        const org = organization.collection.get(id);
        await org?.fetchListMembers.run(search.searchValue);
    }, []);

    return (
        <List
            loading={current?.fetchListMembers.isLoading || organization.fetchItem.isLoading}
            loadingMore={current?.fetchMoreListMembers.isLoading}
            dataSource={current?.listMembers.asArray}
            isReachedEnd={!current?.listMembers.isMorePages}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={item => <ListItem item={item} organizationId={id ?? ''} />}
        />
    );
});
