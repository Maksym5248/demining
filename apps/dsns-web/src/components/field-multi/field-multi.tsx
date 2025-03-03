import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react-lite';

import { Icon } from '../icon';

interface Props<T> {
    name: string;
    label: string;
    manual?: boolean;
    renderField: (params: { value: T; remove: () => void; update: (newValue: T) => void; i: number }) => JSX.Element;
}

function Component<T>({ label, name: rootName, manual = false, renderField }: Props<T>) {
    return (
        <Form.Item label={label} name={rootName}>
            <Form.List name={rootName}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name: i, ...restField }) => (
                            <Form.Item key={key} noStyle shouldUpdate={() => true}>
                                {({ getFieldValue, setFieldValue }) => {
                                    const values = getFieldValue(rootName) as T[];
                                    const value = values[i];

                                    const removeValue = () => remove(i);
                                    const updateValue = (newValue: T) => {
                                        const newValues = values.map((v, index) => (index === i ? newValue : v));
                                        setFieldValue(rootName, newValues);
                                    };

                                    console.log('value', value);

                                    return (
                                        <div style={{ display: 'flex' }}>
                                            <Form.Item name={manual ? undefined : i} {...restField}>
                                                {renderField({ value, remove: removeValue, update: updateValue, i })}
                                            </Form.Item>
                                            <Button
                                                key="list-remove"
                                                icon={<Icon.DeleteOutlined style={{ color: 'red' }} />}
                                                onClick={removeValue}
                                                style={{ marginLeft: 5 }}
                                            />
                                        </div>
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

export const FieldMulty = observer(Component);
