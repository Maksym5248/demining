import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, EQUIPMENT_TYPE, WIZARD_MODE } from '~/constants';
import { IEquipment } from '~/stores';

import { s } from './equipment-list.styles';

const { Text } = Typography;

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
	const { equipment } = useStore();
	const title = useRouteTitle();
	const search = useSearch();

	const onCreate = () => {
		Modal.show(MODALS.EQUIPMENT_WIZARD, { mode: WIZARD_MODE.CREATE})
	};

	const onSearch = (value:string) => {
		search.updateSearchParams(value)
		equipment.fetchList.run(value);
	}

	const onLoadMore = () => {
		equipment.fetchListMore.run(search.searchValue);
	}

	useEffect(() => {
		equipment.fetchList.run(search.searchValue);
	}, []);

	const list = search.searchValue ? equipment.searchList :  equipment.list;

	return (
		<List
			loading={equipment.fetchList.inProgress}
			loadingMore={equipment.fetchListMore.inProgress}
			isReachedEnd={!list.isMorePages}
			dataSource={list.asArray}
			onLoadMore={onLoadMore}
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