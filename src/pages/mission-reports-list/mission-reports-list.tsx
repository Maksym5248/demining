import React, { useEffect } from 'react';

import { Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { IMissionReport } from '~/stores';
import { Icon, List } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';

import { s } from './mission-reports-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IMissionReport}) => {
	const store = useStore();

	const onGoToIMissionReportEdit = (id:string) => (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.MISSION_REPORT_CREATE, { id })
	};

	const onRemove = (id:string) => () => {
		store.missionReport.remove.run(id);
	};
  
	const onCancel = () => {
		message.error('Скасовано');
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoToIMissionReportEdit(item.id)}/>,
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
				avatar={<Icon.FileTextOutlined />}
				title={item.number}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{str.upperFirst(item.address)}</Text>
						<Text type="secondary">{item.executedAt.format('DD.MM.YYYY')}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const MissionReportsListPage  = observer(() => {
	const title = useRouteTitle();

	const store = useStore();

	const onGoToMissionReportCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.MISSION_REPORT_CREATE)
	};

	useEffect(() => {
		store.missionReport.fetchList.run();
	}, []);

	return (
		<List
			loading={store.missionReport.fetchList.inProgress}
			dataSource={store.missionReport.list.asArray}
			style={{ minHeight: 300}}
			header={
				<Space css={s.listHeader}>
					<Title level={4}>{title}</Title>
					<Button type="primary" icon={<Icon.FileAddOutlined />} onClick={onGoToMissionReportCreate}/>
				</Space>
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});