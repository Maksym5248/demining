import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle, useNavigate } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, ROUTES, WIZARD_MODE } from '~/constants';
import { IOrganization } from '~/stores/stores/organization/entities/organization';

import { s } from './organizations-list.styles';

const { Title } = Typography;

const ListItem = observer(({ item }: { item: IOrganization}) => {
	const navigate = useNavigate();
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.ORGANIZATION_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	const onOpenUsers = (e:React.SyntheticEvent) => {
		e.preventDefault();
		navigate(ROUTES.MEMBERS_LIST.replace(":organizationId", item.id))
	};

	return (
		<List.Item
			key={item.id}
			actions={[
				<Button key="list-members" icon={<Icon.TeamOutlined type="danger"/>} onClick={onOpenUsers}/>,
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.UserOutlined />}
				title={item.name}
			/>
		</List.Item>
	)
});

export const OrganizationsListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.ORGANIZATION_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	useEffect(() => {
		store.organization.fetchList.run();
	}, []);

	return (
		<List
			loading={store.organization.fetchList.inProgress}
			dataSource={store.organization.list.asArray}
			header={
				<Space css={s.listHeader}>
					<Title level={4}>{title}</Title>
					<Button type="primary" icon={<Icon.PlusOutlined />} onClick={onCreate}/>
				</Space>
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});