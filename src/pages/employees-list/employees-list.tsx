import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';

import { IEmployee } from '~/stores';
import { Icon, List, ListHeader } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, WIZARD_MODE } from '~/constants';

import { s } from './employees-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IEmployee}) => {
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.EMPLOYEES_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	return (
		<List.Item
			key={item.id}
			actions={[
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.UserOutlined />}
				title={str.getFullName(item)}
				description={
					<Space css={s.listItemDesc}>
						<Text type="secondary">{str.toUpperFirst(item.rank.fullName)}</Text>
						<Text type="secondary">{str.toUpperFirst(item.position)}</Text>
					</Space>
				}
			/>
		</List.Item>
	)
});

export const EmployeesListPage  = observer(() => {
	const { employee } = useStore();
	const title = useRouteTitle();
	const search = useSearch();

	const onCreate = () => {
		Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE})
	};

	const onSearch = (value:string) => {
		search.updateSearchParams(value)
		employee.fetchList.run(value);
	}

	const onLoadMore = () => {
		employee.fetchListMore.run(search.searchValue);
	}

	useEffect(() => {
		employee.fetchList.run(search.searchValue);
	}, []);

	const list = search.searchValue ? employee.searchList :  employee.list;

	return (
		<List
			loading={employee.fetchList.inProgress}
			loadingMore={employee.fetchListMore.inProgress}
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