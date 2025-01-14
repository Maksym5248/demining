import { useEffect } from 'react';

import { Form } from 'antd';
import { isArray } from 'lodash';
import { type EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';
import { type IExplosiveObjectClassItem, useValues /*, type IExplosiveObjectClassItem */ } from 'shared-my-client';

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
                    {({ getFieldValue, setFieldValue }) => {
                        const selectedIds: string[] = getFieldValue('classItemIds') ?? [];
                        const classes = classifications.getBy({ typeId, component });

                        const itemsOptions = transformTreeNodesToTreeData<IExplosiveObjectClassItem>(
                            classes,
                            (item) => item?.displayName ?? '',
                        );

                        const onChange = (value: string[]) => setFieldValue('classItemIds', isArray(value) ? value : [value]);

                        return (
                            <Form.Item>
                                <TreeSelect
                                    treeData={itemsOptions}
                                    onChange={onChange}
                                    value={selectedIds}
                                    // showCheckedStrategy={TreeSelect.SHOW_PARENT}
                                    multiple
                                    style={{ marginBottom: 0 }}
                                />
                            </Form.Item>
                        );
                    }}
                </Form.Item>
            </Form.Item>
        )
    );
};
