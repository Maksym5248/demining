import React, { useEffect, useMemo } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';
import { type INodeClassification } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const Section = observer(({ name }: { name: string }) => {
    return (
        <List.Item>
            <List.Item.Meta title={name} />
        </List.Item>
    );
});

interface ISection {
    id: string;
    name: string;
    isSection: boolean;
}

const ListItem = observer(({ item }: { item: INodeClassification }) => {
    const params = useParams<{ id: string }>();

    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW, typeId: params.id });
    };

    return (
        <List.Item
            actions={[
                <Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />,
                <Button key="list-class-item" icon={<Icon.ApartmentOutlined type="danger" />} onClick={onOpen} />,
            ]}>
            <List.Item.Meta title={item?.disaplyName} />
        </List.Item>
    );
});

export const ExplosiveObjectClassificationPage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();
    const params = useParams<{ id: string }>();

    const listAmmo = explosiveObject.classifications.getArray(params.id ?? '', EXPLOSIVE_OBJECT_COMPONENT.AMMO);
    const listFuse = explosiveObject.classifications.getArray(params.id ?? '', EXPLOSIVE_OBJECT_COMPONENT.FUSE);

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION_WIZARD, { mode: WIZARD_MODE.CREATE, typeId: params.id });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    useEffect(() => {
        explosiveObject.class.search.setSearchBy(search.searchBy);
    }, [search.searchBy]);

    const data = useMemo(() => {
        const items = [];

        if (listAmmo.length) {
            items.push({ id: '1', name: 'Боєприпаси', isSection: true });
            items.push(...listAmmo);
        }

        if (listFuse.length) {
            items.push({ id: '2', name: 'Підривники', isSection: true });
            items.push(...listFuse);
        }

        return items;
    }, []);

    return (
        <List
            isReachedEnd
            dataSource={data}
            header={<ListHeader title={title} onCreate={onCreate} onSearch={onSearch} {...search} />}
            renderItem={(item) =>
                (item as ISection)?.isSection ? <Section name={item.id} /> : <ListItem item={item as INodeClassification} />
            }
        />
    );
});
