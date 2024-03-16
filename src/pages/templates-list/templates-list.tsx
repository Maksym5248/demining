import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, WIZARD_MODE } from '~/constants';
import { IDocument } from '~/stores';
import { str } from '~/utils';

import { s } from './templates-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IDocument}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TEMPLATE_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
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
	const search = useSearch();

	const onCreate = () => {
		Modal.show(MODALS.TEMPLATE_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	const onSearch = (value:string) => {
		search.updateSearchParams(value)
		store.document.fetchTemplatesList.run(value);
	}

	useEffect(() => {
		store.document.fetchTemplatesList.run(search.searchBy);
	}, []);

	return (
		<List
			rowKey="id"
			itemLayout="horizontal"
			loading={store.document.fetchTemplatesList.inProgress}
			loadingMore={store.document.fetchTemplatesListMore.inProgress}
			isReachedEnd={!store.document.templatesList.isMorePages}
			onLoadMore={store.document.fetchTemplatesListMore.run}
			dataSource={store.document.templatesList.asArray}
			header={
				<ListHeader
					title={title}
					onSearch={onSearch}
					onCreate={onCreate}
					{...search}
				 />
			}
			renderItem={(item) => <ListItem item={item}/>}
		/>
	);
});