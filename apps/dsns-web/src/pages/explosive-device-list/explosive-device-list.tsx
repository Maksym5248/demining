import React, { useEffect } from 'react';

import { Button, Typography, Space, Badge } from 'antd';
import { observer } from 'mobx-react';
import { EXPLOSIVE_DEVICE_TYPE } from 'shared-my';
import { type IExplosiveDevice } from 'shared-my-client';

import { Icon, List, ListHeader, Image } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './explosive-device-list.styles';

const { Text } = Typography;

const types = {
    [EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE]: 'Вибухові речовини',
    [EXPLOSIVE_DEVICE_TYPE.DETONATOR]: 'Засоб підриву',
};

const ListItem = observer(({ item }: { item: IExplosiveDevice }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_DEVICE_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    const children = (
        <List.Item actions={[<Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Image src={item.data.imageUri ?? undefined} width={70} />}
                title={item.data.name}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{types[item.data.type]}</Text>
                    </Space>
                }
            />
        </List.Item>
    );

    return !item.isConfirmed ? (
        <Badge.Ribbon text={item.isPending ? 'Очікує' : 'Відхилено'} color={item.isPending ? 'yellow' : 'red'}>
            {children}
        </Badge.Ribbon>
    ) : (
        children
    );
});

export const ExplosiveDeviceListPage = observer(() => {
    const { explosiveDevice } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_DEVICE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        explosiveDevice.fetchList.run(value);
    };

    const onLoadMore = () => {
        explosiveDevice.fetchMoreList.run(search.searchValue);
    };

    useEffect(() => {
        explosiveDevice.fetchList.run(search.searchValue);
    }, []);

    return (
        <List
            loading={explosiveDevice.fetchList.isLoading}
            loadingMore={explosiveDevice.fetchMoreList.isLoading}
            isReachedEnd={!explosiveDevice.list.isMorePages}
            dataSource={explosiveDevice.list.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} {...search} />}
            renderItem={item => <ListItem item={item} />}
        />
    );
});
