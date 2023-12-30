import React, { useEffect } from 'react';

import { List, Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { Icon } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, EQUIPMENT_TYPE } from '~/constants';
import { IEquipment } from '~/stores';

import { s } from './equipment-list.styles';

const { Title, Text } = Typography;

const types = {
	[EQUIPMENT_TYPE.MINE_DETECTOR]: "Міношукач",
}

const ListItem = observer(({ item }: { item: IEquipment}) => {
	const store = useStore();

	const onGoEdit = (id:string) => (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EQUIPMENT_CREATE, { id })
	};

	const onRemove = (id:string) => () => {
		store.equipment.remove.run(id);
	};
  
	const onCancel = () => {
		message.error('Скасовано');
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoEdit(item.id)}/>,
				<Popconfirm
					key="list-remove"
					title="Видалити"
					description="Ви впевнені, після цього дані не можливо відновити ?"
					onConfirm={onRemove(item.id)}
					onCancel={onCancel}
					okText="Так"
					cancelText="Ні"
				>
					<Button icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
				</Popconfirm>
			]}
		>
			<List.Item.Meta
				avatar={<Icon.FileTextOutlined />}
				title={item.name}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{types[item.type]}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const EquipmentListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EQUIPMENT_CREATE)
	};

	useEffect(() => {
		store.equipment.fetchList.run();
	}, []);

	return (
		<List
			rowKey="id"
			itemLayout="horizontal"
			loading={store.equipment.fetchList.inProgress}
			dataSource={store.equipment.list.asArray}
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