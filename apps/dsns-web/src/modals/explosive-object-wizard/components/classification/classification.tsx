import { Form } from 'antd';
import { TREE_ROOT_ID } from 'shared-my-client';
import { type IExplosiveObjectClassItem } from 'shared-my-client';

import { TreeSelect } from '~/components';
import { useStore } from '~/hooks';
import { transformTreeNodesToTreeData } from '~/utils';

export const Classification = () => {
    const { explosiveObject } = useStore();

    return (
        <Form.Item noStyle shouldUpdate={() => true}>
            {({ getFieldValue }) => {
                const groupId = getFieldValue('groupId');
                const component = getFieldValue('component');

                return (
                    !!groupId &&
                    !!component && (
                        <Form.Item
                            label="Класифікація"
                            name="classIds"
                            rules={[{ message: "Обов'язкове поле" }]}
                            style={{ marginBottom: 0 }}>
                            <Form.Item noStyle shouldUpdate={() => true}>
                                {({ getFieldValue, setFieldValue }) => {
                                    const classItemsIds: string[] = getFieldValue('classIds') ?? [];
                                    const classsifications = explosiveObject.getClassesByGroupId(groupId, component);

                                    return classsifications
                                        .map((classification) => {
                                            const children =
                                                classification.itemsTree.tree?.children.filter(
                                                    (item) =>
                                                        !item?.item?.data.parentId || !!classItemsIds.includes(item?.item.data.parentId),
                                                ) ?? [];

                                            const onChange = (newValue: string) => {
                                                const classItemsIds = classification.items.map((item) => item.data.id);

                                                const prevValue = classItemsIds.filter((id: string) => classItemsIds.includes(id));
                                                const prevValueChilds = prevValue
                                                    .map((id: string) => explosiveObject.treeClassesItems.getAllChildsIds(id))
                                                    .reduce((acc: string[], val: string[]) => [...acc, ...val], []);

                                                let value = classItemsIds.filter(
                                                    (id: string) => ![...prevValue, ...prevValueChilds].includes(id),
                                                );

                                                if (newValue) {
                                                    const newValueParents = explosiveObject.treeClassesItems
                                                        .getAllParentsIds(newValue)
                                                        .filter((id: string) => id !== TREE_ROOT_ID)
                                                        .filter((id) => !value.includes(id));
                                                    value = [...value, newValue, ...newValueParents];
                                                }

                                                setFieldValue('classIds', value);
                                            };

                                            if (!children.length) return undefined;

                                            const treeData = transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                                                classification.itemsTree?.tree?.children ?? [],
                                                (item) => item?.data?.name ?? '',
                                            );

                                            const currentClassIds = classItemsIds
                                                .map((id) => classification.itemsTree?.getNode(id))
                                                .filter(Boolean)
                                                .filter((el) => !el?.children?.length);

                                            return (
                                                <Form.Item key={classification.data.id}>
                                                    <TreeSelect
                                                        treeData={treeData}
                                                        value={currentClassIds[0]?.id}
                                                        placeholder={classification.displayName}
                                                        onChange={onChange}
                                                        style={{ marginBottom: 0 }}
                                                    />
                                                </Form.Item>
                                            );
                                        })
                                        .filter(Boolean);
                                }}
                            </Form.Item>
                        </Form.Item>
                    )
                );
            }}
        </Form.Item>
    );
};
