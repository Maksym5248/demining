import { useEffect } from 'react';

import { Form } from 'antd';
import { uniq } from 'lodash';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';
import { useValues, type IExplosiveObjectClassItem } from 'shared-my-client';

import { TreeSelect } from '~/components';
import { useStore } from '~/hooks';
import { transformTreeNodesToTreeData } from '~/utils';

interface ClassificationProps {
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    setFieldValue: (name: string, value: any) => void;
}

export const Classification = ({ typeId, component, setFieldValue }: ClassificationProps) => {
    const { explosiveObject } = useStore();
    const { classifications: classificationsStore } = explosiveObject;
    const values = useValues();

    useEffect(() => {
        if (!values.get('isInitialized')) {
            values.set('isInitialized', true);
            return;
        }

        setFieldValue('classIds', []);
    }, [typeId, component]);

    return (
        !!typeId &&
        !!component && (
            <Form.Item label="Класифікація" name="classIds" style={{ marginBottom: 0 }}>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue, setFieldValue }) => {
                        const selectedIds: string[] = getFieldValue('classIds') ?? [];
                        const classifications = classificationsStore.getBy(typeId, component);

                        return classifications
                            .map((classification) => {
                                const currentSelectedItem = classification.getItemsByIds(selectedIds)[0];

                                const isSelectedItems = !!currentSelectedItem;
                                const isRootItems = !!classification.isRootItems(selectedIds);

                                if (!isRootItems && !isSelectedItems) return false;

                                const onChange = (newValue: string) => {
                                    const restSelectedItemsIds = classification.getItemsIdsByExludedIds(selectedIds);
                                    const newValuesIds = uniq([...restSelectedItemsIds, newValue].filter(Boolean));
                                    let removeArray: string[] = [];

                                    if (!!currentSelectedItem?.data?.id && newValue !== currentSelectedItem?.data?.id) {
                                        removeArray = classificationsStore.treeItems.getAllChildsIds(currentSelectedItem.data.id);
                                    }

                                    setFieldValue(
                                        'classIds',
                                        newValuesIds.filter((id) => !removeArray.includes(id)),
                                    );
                                };

                                const itemsOptions = transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                                    classification.treeItems?.tree?.children ?? [],
                                    (item) => item?.data?.name ?? '',
                                );

                                const itemValue = classification.treeItems.getNode(currentSelectedItem?.data.id);

                                return (
                                    <Form.Item key={classification.data.id}>
                                        <TreeSelect
                                            treeData={itemsOptions}
                                            value={itemValue?.id}
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
};
