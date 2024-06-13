import React, { useEffect, useState } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import { Icon, List } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useAsyncEffect } from '~/hooks';
import { Modal } from '~/services';
import { IUser } from '~/stores';

import { s } from './members-list.styles';

const { Title, Text } = Typography;

const ListItem = observer(({ item, organizationId }: { item: IUser; organizationId: string }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { organizationId, id: item?.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item key={item.id} actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.UserOutlined />}
                title={item.email}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{item.isOrganizationAdmin ? 'Адмін' : ''}</Text>
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
    const [id, setId] = useState(organizationId ?? '');

    const currentOrganization = organization.collection.get(id);

    const onCreate = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.MEMBER_WIZARD, { mode: WIZARD_MODE.CREATE, organizationId: id });
    };

    useAsyncEffect(async () => {
        if (!currentOrganization) {
            await organization.fetchItem.run(viewer.user?.organization?.id ?? '');
            setId(viewer.user?.organization?.id ?? '');
        }
    }, []);

    useEffect(() => {
        if (id) {
            currentOrganization?.fetchMembers.run();
        }
    }, [id]);

    return (
        <List
            loading={currentOrganization?.fetchMembers.isLoading || organization.fetchItem.isLoading}
            dataSource={currentOrganization?.members.asArray}
            isReachedEnd
            header={
                <Space css={s.listHeader}>
                    <Title level={4}>{title}</Title>
                    <Button type="primary" icon={<Icon.UserAddOutlined />} onClick={onCreate} />
                </Space>
            }
            renderItem={(item) => <ListItem item={item} organizationId={id ?? ''} />}
        />
    );
});
