import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, EQUIPMENT_TYPE, WIZARD_MODE } from '~/constants';
import { IEquipment } from '~/stores';

import { s } from './equipment-list.styles';

const { Title, Text } = Typography;

const types = {
	[EQUIPMENT_TYPE.MINE_DETECTOR]: "Міношукач",
}

const ListItem = observer(({ item }: { item: IEquipment}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EQUIPMENT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
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
		Modal.show(MODALS.EQUIPMENT_WIZARD, { mode: WIZARD_MODE.CREATE})
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