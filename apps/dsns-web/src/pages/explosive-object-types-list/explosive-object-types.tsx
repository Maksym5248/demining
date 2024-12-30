import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { type IExplosiveObjectType } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const ListItem = observer(({ item }: { item: IExplosiveObjectType }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_OBJECT_TYPE_WIZARD, { id: item.data.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item
            actions={[
                <Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />,
                <Button key="list-edit" icon={<Icon.ApartmentOutlined type="danger" />} onClick={onOpen} />,
            ]}>
            <List.Item.Meta title={item?.displayName} />
        </List.Item>
    );
});

export const ExplosiveObjectTypesPage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_TYPE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    useEffect(() => {
        explosiveObject.type.search.setSearchBy(search.searchBy);
    }, [search.searchBy]);

    return (
        <List
            isReachedEnd
            dataSource={explosiveObject.type.search.asArray}
            header={<ListHeader title={title} onCreate={onCreate} onSearch={onSearch} {...search} />}
            renderItem={(item) => <ListItem item={item} />}
        />
    );
});
