import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';
import { IMissionRequest } from '~/stores';

import { s } from './mission-request-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IMissionRequest}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.MISSION_REQUEST_WIZARD, { id: item.id })
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.FileTextOutlined />}
				title={`№${item.number}`}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{item.signedAt.format('DD/MM/YYYY')}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const MissionRequestListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.MISSION_REQUEST_WIZARD)
	};

	useEffect(() => {
		store.missionRequest.fetchList.run();
	}, []);

	return (
		<List
			loading={store.missionRequest.fetchList.inProgress}
			dataSource={store.missionRequest.list.asArray}
			header={
				<Space css={s.listHeader}>
					<Title level={4}>{title}</Title>
					<Button type="primary" icon={<Icon.FileAddOutlined />} onClick={onGoToEmployeesCreate}/>
				</Space>
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});