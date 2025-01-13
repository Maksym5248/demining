import React, { useMemo } from 'react';

import { Tree, type TreeDataNode, Typography } from 'antd';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { TypeNodeClassification } from 'shared-my-client';

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

    const list = explosiveObject.classifications
        .flattenSections(params.id)
        ?.filter((item) => item.displayName?.toLocaleLowerCase().includes(search.searchBy?.toLocaleLowerCase()));

    const onCreate = (e: React.SyntheticEvent, parentId?: string) => {
        e.preventDefault();

        const parent = parentId ? explosiveObject.classItem.collection.get(parentId) : undefined;

        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, {
            mode: WIZARD_MODE.CREATE,
            typeId: params.id,
            classId: parent?.data?.classId,
            component: parent?.data?.component,
            parentId: parent?.data?.id,
        });
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
    };

    const getByDeep = (item: TreeDataNode, deep: number): TreeDataNode => {
        if (item?.children?.length && deep > 0) {
            return getByDeep(item?.children[item?.children?.length - 1], deep - 1);
        } else {
            return item;
        }
    };

    const onOpen = (e: any, node: TreeDataNode) => {
        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASS_ITEM_WIZARD, { id: node.key, mode: WIZARD_MODE.VIEW, typeId: params.id });
    };

    const onDrop = async ({ node, dragNode }: { node: TreeDataNode; dragNode: TreeDataNode }) => {
        const item = explosiveObject.classItem.collection.get(dragNode?.key as string);
        await item?.update.run({ parentId: node?.key as string });
    };

    const treeData = useMemo(() => {
        const res: TreeDataNode = {
            title: 'Класифікація',
            key: '0',
            children: [],
        };

        list.forEach((item, index) => {
            const section = res.children?.[res.children?.length - 1];

            if (item.type === TypeNodeClassification.Section) {
                res.children?.push({
                    title: item.displayName,
                    key: item.id,
                    children: [],
                });
            } else if (section && item.type !== TypeNodeClassification.Class) {
                const parent = getByDeep(section, item.deep);
                const prev = list[index - 1];
                const subTitle = prev.type === TypeNodeClassification.Class ? prev.displayName : undefined;

                parent.children?.push({
                    title: subTitle ? `${item.displayName} (${subTitle})` : item.displayName,
                    key: item.id,
                    children: [],
                });
            }
        });

        return res;
    }, [list]);

    const titleRender = (node: TreeDataNode) => (
        <div css={s.title}>
            <Typography.Text onClick={(e) => onOpen(e, node)}>{node?.title as string}</Typography.Text>
            <Icon.PlusOutlined type="danger" onClick={(e) => onCreate(e, node?.key as string)} />
        </div>
    );

    return (
        <div css={s.container}>
            <ListHeader title={title} onCreate={onCreate} onSearch={onSearch} {...search} />
            <Tree
                showLine
                showIcon
                defaultExpandedKeys={['0-0-0']}
                onDrop={onDrop}
                treeData={treeData.children}
                defaultExpandAll
                draggable
                titleRender={titleRender}
            />
        </div>
    );
});
