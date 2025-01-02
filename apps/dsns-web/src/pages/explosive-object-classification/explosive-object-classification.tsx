import React, { useEffect } from 'react';

import { Button } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { type IClassItemNode, type IClassNode, type ISectionNode, TypeNodeClassification } from 'shared-my-client';

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

const ListItemClass = observer(({ item }: { item: IClassNode }) => {
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
            <List.Item.Meta title={item?.displayName} />
        </List.Item>
    );
});

const ListItemClassItem = observer(({ item }: { item: IClassItemNode }) => {
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
            <List.Item.Meta title={item?.displayName} />
        </List.Item>
    );
});

export const ExplosiveObjectClassificationPage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();
    const params = useParams<{ id: string }>();

    const list = explosiveObject.classifications.flattenSections(params.id ?? '');

    const onCreate = () => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION_WIZARD, { mode: WIZARD_MODE.CREATE, typeId: params.id });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    useEffect(() => {
        explosiveObject.class.search.setSearchBy(search.searchBy);
    }, [search.searchBy]);

    const renderItem = (item: IClassNode | IClassItemNode | ISectionNode) => {
        if ((item as ISectionNode)?.type === TypeNodeClassification.Section.valueOf()) {
            return <Section item={item} />;
        } else if ((item as IClassNode)?.type === TypeNodeClassification.Class.valueOf()) {
            return <ListItemClass item={item as IClassNode} />;
        } else if ((item as IClassItemNode)?.type === TypeNodeClassification.ClassItem.valueOf()) {
            return <ListItemClassItem item={item as IClassItemNode} />;
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
