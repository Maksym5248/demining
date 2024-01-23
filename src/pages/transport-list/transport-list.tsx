import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, TRANSPORT_TYPE } from '~/constants';
import { ITransport } from '~/stores';

import { s } from './transport-list.styles';

const { Title, Text } = Typography;

const types = {
	[TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS]: "ВНП",
	[TRANSPORT_TYPE.FOR_HUMANS]: "о/с"
}

const ListItem = observer(({ item }: { item: ITransport}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TRANSPORT_CREATE, { id: item.id })
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.FileTextOutlined />}
				title={item.name}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{types[item.type]}</Text>
						<Text type="secondary">{item.number}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const TransportListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TRANSPORT_CREATE)
	};

	useEffect(() => {
		store.transport.fetchList.run();
	}, []);

	return (
		<List
			loading={store.transport.fetchList.inProgress}
			dataSource={store.transport.list.asArray}
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