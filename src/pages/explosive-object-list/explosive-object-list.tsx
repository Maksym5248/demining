import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, WIZARD_MODE } from '~/constants';
import { IExplosiveObject } from '~/stores';

import { s } from './explosive-object-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IExplosiveObject}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				title={item.type.fullName}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{item.displayName}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const ExplosiveObjectListPage  = observer(() => {
	const { explosiveObject } = useStore();
	const title = useRouteTitle();

	const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { mode: WIZARD_MODE.CREATE})
	};

	useEffect(() => {
		explosiveObject.fetchList.run();
	}, []);

	return (
		<List
			loading={explosiveObject.fetchList.inProgress}
			dataSource={explosiveObject.sortedList}
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