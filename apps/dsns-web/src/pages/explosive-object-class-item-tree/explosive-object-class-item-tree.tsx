import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { type INode, type ISectionNode, TypeNodeClassification } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

const Section = observer(({ item }: { item: ISectionNode }) => {
    return (
        <List.Item>
            <List.Item.Meta title={item.displayName} />
        </List.Item>
    );
});

const ListItem = observer(({ item }: { item: INode }) => {
    const params = useParams<{ id: string }>();

    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW, typeId: params.id });
    };

    return (
        <List.Item
            actions={[
                <Button key="list-edit" icon={<Icon.EyeOutlined type="danger" />} onClick={onOpen} />,
                <Button key="list-class-item" icon={<Icon.ApartmentOutlined type="danger" />} onClick={onOpen} />,
            ]}>
            <List.Item.Meta title={item?.displayName} />
        </List.Item>
    );
});

export const ExplosiveObjectClassItemTreePage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();
    const params = useParams<{ id: string }>();

    const list = explosiveObject.classifications.flattenSections(params.id ?? '');

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, { mode: WIZARD_MODE.CREATE, typeId: params.id });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    useEffect(() => {
        explosiveObject.class.search.setSearchBy(search.searchBy);
    }, [search.searchBy]);

    const renderItem = (item: INode) => {
        if (item?.type === TypeNodeClassification.Section.valueOf()) {
            return <Section item={item} />;
        } else if (item?.type === TypeNodeClassification.ClassItem.valueOf()) {
            return <ListItem item={item} />;
        }

        return null;
    };

    return (
        <List
            isReachedEnd
            dataSource={list}
            header={<ListHeader title={title} onCreate={onCreate} onSearch={onSearch} {...search} />}
            renderItem={renderItem}
        />
    );
});
