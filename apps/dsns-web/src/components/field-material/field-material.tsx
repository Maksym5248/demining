import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react-lite';

import { SelectAsync } from '~/components';
import { useStore } from '~/hooks';

function Component() {
    const store = useStore();

    return (
        <Form.Item label="Корпус" name="material">
            <Form.List name="material">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Form.Item key={key} noStyle shouldUpdate={() => true}>
                                {({ getFieldValue }) => {
                                    const material = getFieldValue('material');
                                    const currentSelectedId = material[name];

                                    return (
                                        <Form.Item name={name} {...restField}>
                                            <SelectAsync
                                                options={store.common.collections.materials.asArray.map(el => ({
                                                    label: el?.displayName,
                                                    value: el.id,
                                                }))}
                                                value={currentSelectedId}
                                                suffixIcon={
                                                    currentSelectedId ? (
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                remove(name);
                                                            }}
                                                        />
                                                    ) : (
                                                        <DownOutlined />
                                                    )
                                                }
                                            />
                                        </Form.Item>
                                    );
                                }}
                            </Form.Item>
                        ))}
                        <Form.Item noStyle shouldUpdate={() => true}>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Додати
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form.Item>
    );
}

export const FieldMaterial = observer(Component);
