import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';
import { IOrder } from '~/stores';

import { s } from './orders-list.styles';

const { Title, Text } = Typography;

const ListItem = observer(({ item }: { item: IOrder}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.ORDER_CREATE, { id: item.id })
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

export const OrdersListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.ORDER_CREATE)
	};

	useEffect(() => {
		store.order.fetchList.run();
	}, []);

	return (
		<List
			loading={store.order.fetchList.inProgress}
			dataSource={store.order.list.asArray}
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