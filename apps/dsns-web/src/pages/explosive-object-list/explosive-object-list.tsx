import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { type IExplosiveObject } from 'shared-my-client';

import { Icon, List, ListHeader, Image } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const ListItem = observer(({ item }: { item: IExplosiveObject }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                title={item?.displayName}
                description={item.type?.displayName}
                avatar={<Image src={item.data.imageUri} width={70} />}
            />
        </List.Item>
    );
});

export const ExplosiveObjectListPage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        explosiveObject.fetchList.run(value);
    };

    const onLoadMore = () => {
        explosiveObject.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        explosiveObject.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            loading={explosiveObject.fetchList.isLoading}
            loadingMore={explosiveObject.fetchMoreList.isLoading}
            isReachedEnd={!explosiveObject.list.isMorePages}
            dataSource={explosiveObject.list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
