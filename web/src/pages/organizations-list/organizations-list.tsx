import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';

import { Icon, List, ListHeader } from '~/components';
import { useStore, useRouteTitle, useNavigate, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { MODALS, ROUTES, WIZARD_MODE } from '~/constants';
import { IOrganization } from '~/stores/stores/organization/entities/organization';


const ListItem = observer(({ item }: { item: IOrganization}) => {
	const navigate = useNavigate();
	const onOpen = (e:React.SyntheticEvent) => {
		e.preventDefault();
		Modal.show(MODALS.ORGANIZATION_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW })
	};

	const onOpenUsers = (e:React.SyntheticEvent) => {
		e.preventDefault();
		navigate(ROUTES.MEMBERS_LIST.replace(":organizationId", item.id))
	};

	return (
		<List.Item
			key={item.id}
			actions={[
				<Button key="list-members" icon={<Icon.TeamOutlined type="danger"/>} onClick={onOpenUsers}/>,
				<Button key="list-edit" icon={<Icon.EyeOutlined type="danger"/>} onClick={onOpen}/>,
			]}
		>
			<List.Item.Meta
				avatar={<Icon.UserOutlined />}
				title={item.name}
			/>
		</List.Item>
	)
});

export const OrganizationsListPage  = observer(() => {
	const { organization } = useStore();
	const title = useRouteTitle();
	const search = useSearch();

	const onCreate = () => {
		Modal.show(MODALS.ORGANIZATION_WIZARD, { mode: WIZARD_MODE.CREATE })
	};

	const onSearch = (value:string) => {
		search.updateSearchParams(value)
		organization.fetchList.run(value);
	}

	const onLoadMore = () => {
		organization.fetchListMore.run(search.searchValue);
	}

	useEffect(() => {
		organization.fetchList.run(search.searchValue);
	}, []);

	const list = search.searchValue ? organization.searchList :  organization.list;

	return (
		<List
			loading={organization.fetchList.inProgress}
			loadingMore={organization.fetchListMore.inProgress}
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