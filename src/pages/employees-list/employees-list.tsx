import React, { useEffect } from 'react';

import { Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { IEmployee } from '~/stores';
import { Icon, List } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';

import { s } from './employees-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IEmployee}) => {
	const store = useStore();

	const onGoToEmployeesEdit = (id:string) => (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EMPLOYEES_CREATE, { id })
	};

	const onRemove = (id:string) => () => {
		store.employee.remove.run(id);
	};
  
	const onCancel = () => {
		message.error('Скасовано');
	};

	return (
		<List.Item
			key={item.id}
			actions={[
				<Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoToEmployeesEdit(item.id)}/>,
				<Popconfirm
					key="list-remove"
					title="Видалити"
					description="Ви впевнені, після цього дані не можливо відновити ?"
					onConfirm={onRemove(item.id)}
					onCancel={onCancel}
					okText="Так"
					cancelText="Ні"
				>
					<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
				</Popconfirm>
			]}
		>
			<List.Item.Meta
				avatar={<Icon.UserOutlined />}
				title={str.getFullName(item)}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{str.upperFirst(item.rank.fullName)}</Text>
						<Text type="secondary">{str.upperFirst(item.position)}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const EmployeesListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EMPLOYEES_CREATE)
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