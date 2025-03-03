import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { materialsData } from 'shared-my';

import { SelectAsync } from '~/components';

function Component() {
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
                                                options={materialsData.map(el => ({
                                                    label: el?.name,
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

export const Material = observer(Component);
