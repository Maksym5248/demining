import React, { useMemo } from 'react';

import { Tree, type TreeDataNode, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';

import { Icon, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';

import { s } from './explosive-object-class-item-tree.styles';

export const ExplosiveObjectClassItemTreePage = observer(() => {
    const { explosiveObject } = useStore();
    const title = useRouteTitle();
    const search = useSearch();
    const params = useParams<{ id: string }>();

    const list = explosiveObject.classifications.getSections(params.id);
    const type = explosiveObject.type.collection.get(params.id);

    const onCreate = (e: React.SyntheticEvent, parentId?: string) => {
        e.preventDefault();

        const parent = parentId ? explosiveObject.classItem.collection.get(parentId) : undefined;
        const cls = parentId ? explosiveObject.class.collection.get(parentId) : undefined;

        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, {
            mode: WIZARD_MODE.CREATE,
            typeId: params.id,
            classId: cls?.id ?? parent?.data?.classId,
            component: parent?.data?.component,
            parentId: parent?.data?.id,
        });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    const onOpen = (e: any, node: TreeDataNode) => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, { id: node.key, mode: WIZARD_MODE.VIEW, typeId: params.id });
    };

    const onDrop = async ({ node, dragNode }: { node: TreeDataNode; dragNode: TreeDataNode }) => {
        const item = explosiveObject.classItem.collection.get(dragNode?.key as string);
        const parent = explosiveObject.classItem.collection.get(node?.key as string);
        const classification = explosiveObject.class.collection.get(node?.key as string);

        if (classification?.id === item?.data.classId || !item) return;

        await item?.update.run(classification ? { parentId: null, classId: classification.id } : { parentId: parent?.id ?? null });
    };

    const getByDeep = (item: TreeDataNode, deep: number): TreeDataNode => {
        if (item?.children?.length && deep > 0) {
            return getByDeep(item?.children[item?.children?.length - 1], deep - 1);
        } else {
            return item;
        }
    };

    const treeData = useMemo(() => {
        const res: TreeDataNode = {
            title: 'Класифікація',
            key: '0',
            children: [],
        };

        list.forEach(component => {
            const componentData: TreeDataNode = {
                title: component.displayName,
                key: component.id,
                children: [],
            };

            res.children?.push(componentData);

            component?.children?.forEach(classification => {
                const classificationData: TreeDataNode = {
                    title: classification.displayName,
                    key: classification.id,
                    children: [],
                };

                componentData.children?.push(classificationData);

                classification.children?.forEach(classItem => {
                    const classItemData: TreeDataNode = {
                        title: classItem.displayName,
                        key: classItem.id,
                        children: [],
                    };

                    const parent = getByDeep(classificationData, classItem.deep);
                    parent.children?.push(classItemData);
                });
            });
        });

        return res;
    }, [list]);

    const titleRender = (node: TreeDataNode) => {
        const item = explosiveObject.classItem.collection.get(node.key as string);

        return (
            <div css={s.title}>
                <Typography.Text onClick={e => item && onOpen(e, node)}>{node?.title as string}</Typography.Text>
                {<Icon.PlusOutlined type="danger" onClick={e => onCreate(e, node?.key as string)} />}
            </div>
        );
    };

    return (
        <div css={s.container}>
            <ListHeader title={type?.displayName ?? title} onCreate={onCreate} onSearch={onSearch} {...search} />
            <Tree
                showLine
                showIcon
                defaultExpandedKeys={['0-0-0']}
                onDrop={onDrop}
                treeData={treeData.children}
                defaultExpandAll
                draggable
                titleRender={titleRender}
                filterTreeNode={node => !!search?.searchBy && !!String(node?.title)?.toLowerCase().includes(search.searchBy.toLowerCase())}
            />
        </div>
    );
});
