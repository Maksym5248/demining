import { useEffect } from 'react';

import { Form } from 'antd';
// import { uniq } from 'lodash';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';
import { useValues /*, type IExplosiveObjectClassItem */ } from 'shared-my-client';

import { TreeSelect } from '~/components';
import { useStore } from '~/hooks';
// import { transformTreeNodesToTreeData } from '~/utils';

interface ClassificationProps {
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    setFieldValue: (name: string, value: any) => void;
}

export const Classification = ({ typeId, component, setFieldValue }: ClassificationProps) => {
    const { explosiveObject } = useStore();
    const { classifications } = explosiveObject;
    const values = useValues();

    useEffect(() => {
        if (!values.get('isInitialized')) {
            values.set('isInitialized', true);
            return;
        }

        setFieldValue('classItemIds', []);
    }, [typeId, component]);

    return (
        !!typeId &&
        !!component && (
            <Form.Item label="Класифікація" name="classItemIds" style={{ marginBottom: 0 }}>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {
                        (/* { getFieldValue, setFieldValue }*/) => {
                            // const selectedIds: string[] = getFieldValue('classItemIds') ?? [];
                            const classes = classifications.getBy({ typeId, component });

                            return classes
                                .map((cls) => {
                                    // const currentSelectedItemsIds = cls.getItemsIdsByIds(selectedIds);
                                    // const currentSelectedItemTree = cls.treeItems.getNodeLowLevel(currentSelectedItemsIds);
                                    // const currentSelectedItem = cls.getItem(currentSelectedItemTree?.id);

                                    // const isSelectedItems = !!currentSelectedItem;
                                    // const isRootItems = !!cls.isRootItems(selectedIds);

                                    // if (!isRootItems && !isSelectedItems) return false;

                                    // const onChange = (newValue: string) => {
                                    //     const restSelectedItemsIds = cls.getItemsIdsByExludedIds(selectedIds);
                                    //     const newValuesIds = uniq([...restSelectedItemsIds, newValue].filter(Boolean));
                                    //     let removeArray: string[] = [];

                                    //     if (!!currentSelectedItem?.data?.id && newValue !== currentSelectedItem?.data?.id) {
                                    //         removeArray = classifications.treeItems.getAllChildsIds(currentSelectedItem.data.id);
                                    //     }

                                    //     const newParrentsIds = cls.treeItems.getAllParentsIds(newValue, true).filter(Boolean);

                                    //     setFieldValue('classItemIds', [
                                    //         ...newParrentsIds,
                                    //         ...newValuesIds.filter((id) => !removeArray.includes(id)),
                                    //     ]);
                                    // };

                                    // const itemsOptions = transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                                    //     classification.treeItems?.tree?.children ?? [],
                                    //     (item) => item?.data?.name ?? '',
                                    // );

                                    // const itemValue = classification.treeItems.getNode(currentSelectedItem?.data.id ?? '');

                                    return (
                                        <Form.Item key={cls.id}>
                                            <TreeSelect
                                                // treeData={itemsOptions}
                                                // value={itemValue?.id}
                                                // placeholder={classification.displayName}
                                                // onChange={onChange}
                                                style={{ marginBottom: 0 }}
                                            />
                                        </Form.Item>
                                    );
                                })
                                .filter(Boolean);
                        }
                    }
                </Form.Item>
            </Form.Item>
        )
    );
};
