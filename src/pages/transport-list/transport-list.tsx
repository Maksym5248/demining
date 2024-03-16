import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, TRANSPORT_TYPE, WIZARD_MODE } from '~/constants';
import { ITransport } from '~/stores';

import { s } from './transport-list.styles';

const { Text } = Typography;

const types = {
	[TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS]: "ВНП",
	[TRANSPORT_TYPE.FOR_HUMANS]: "о/с"
}

const ListItem = observer(({ item }: { item: ITransport}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.TRANSPORT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
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
	const { transport } = useStore();
	const title = useRouteTitle();
	const search = useSearch();

	const onCreate = () => {
		Modal.show(MODALS.TRANSPORT_WIZARD,  { mode: WIZARD_MODE.CREATE})
	};

	const onSearch = (value:string) => {
		search.updateSearchParams(value)
		transport.fetchList.run(value);
	}

	useEffect(() => {
		transport.fetchList.run(search.searchBy);
	}, []);

	return (
		<List
			loading={transport.fetchList.inProgress}
			loadingMore={transport.fetchListMore.inProgress}
			isReachedEnd={!transport.list.isMorePages}
			onLoadMore={transport.fetchListMore.run}
			dataSource={transport.list.asArray}
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