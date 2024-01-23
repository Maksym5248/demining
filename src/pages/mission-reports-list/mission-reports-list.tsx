import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { IMissionReport } from '~/stores';
import { Icon, List } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { WIZARD_MODE, MODALS } from '~/constants';

import { s } from './mission-reports-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IMissionReport}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.MISSION_REPORT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	return (
		<List.Item
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
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
		Modal.show(MODALS.MISSION_REPORT_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	useEffect(() => {
		store.missionReport.fetchList.run();
	}, []);

	return (
		<List
			loading={store.missionReport.fetchList.inProgress}
			dataSource={store.missionReport.list.asArray}
			style={{ flex: 1}}
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