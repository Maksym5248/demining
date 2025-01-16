import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { type IExplosive } from 'shared-my-client';

import { Icon, List, ListHeader, Image } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const ListItem = observer(({ item }: { item: IExplosive }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta title={item?.displayName} avatar={<Image src={item.data.imageUri ?? undefined} width={70} />} />
        </List.Item>
    );
});

export const ExplosiveListPage = observer(() => {
    const { explosive } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        explosive.fetchList.run(value);
    };

    const onLoadMore = () => {
        explosive.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        explosive.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            loading={explosive.fetchList.isLoading}
            loadingMore={explosive.fetchMoreList.isLoading}
            isReachedEnd={!explosive.list.isMorePages}
            dataSource={explosive.list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
