import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { IEmployee } from '~/stores';
import { Icon, List } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, WIZARD_MODE } from '~/constants';

import { s } from './organizations-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IEmployee}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EMPLOYEES_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	return (
		<List.Item
			key={item.id}
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.UserOutlined />}
				title={str.getFullName(item)}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{str.toUpperFirst(item.rank.fullName)}</Text>
						<Text type="secondary">{str.toUpperFirst(item.position)}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const OrganizationsListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE})
	};

	useEffect(() => {
		store.employee.fetchList.run();
	}, []);

	return (
		<List
			loading={store.employee.fetchList.inProgress}
			dataSource={store.employee.list.asArray}
			header={
				<Space css={s.listHeader}>
					<Title level={4}>{title}</Title>
					<Button type="primary" icon={<Icon.UserAddOutlined />} onClick={onGoToEmployeesCreate}/>
				</Space>
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});