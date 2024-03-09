import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, WIZARD_MODE } from '~/constants';
import { IDocument } from '~/stores';
import { str } from '~/utils';

import { s } from './templates-list.styles';

const { Title, Text } = Typography;

const ListItem = observer(({ item }: { item: IDocument}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TEMPLATE_WIZARD, { id: item.id, mode: WIZARD_MODE.CREATE })
	};

	return (
		<List.Item
			actions={[
				<Button key="list-view" icon={<Icon.EyeOutlined />} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.FileTextOutlined />}
				title={item.name}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{str.getValue(item.documentType)}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const TemplatesListPage  = observer(() => {
	const store = useStore();
	const title = useRouteTitle();

	const onGoToTemplateCreate = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TEMPLATE_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	useEffect(() => {
		store.document.fetchTemplatesList.run();
	}, []);

	return (
		<List
			rowKey="id"
			itemLayout="horizontal"
			loading={store.document.fetchTemplatesList.inProgress}
			dataSource={store.document.templatesList.asArray}
			header={
				<Space css={s.listHeader}>
					<Title level={4}>{title}</Title>
					<Button type="primary" icon={<Icon.FileAddOutlined />} onClick={onGoToTemplateCreate}/>
				</Space>
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});