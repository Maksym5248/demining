import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, List } from 'antd';
import { observer } from 'mobx-react-lite';

import { Icon } from '~/components';
import { type MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';

export interface FieldModalListItemProps<T> {
    item: T;
    index: number;
    getTitle: (item: T) => string;
    getDescription?: (item: T) => string | undefined | null;
    onRemove: (index: number) => void;
}

function ListItem<T>({ item, index, getTitle, getDescription, onRemove }: FieldModalListItemProps<T>) {
    const _onRemove = () => onRemove?.(index);

    return (
        <List.Item actions={[<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: 'red' }} />} onClick={_onRemove} />]}>
            <List.Item.Meta title={getTitle(item)} description={getDescription?.(item)} />
        </List.Item>
    );
}

const ObservedListItem = observer(ListItem);

interface Props<T> {
    label: string;
    name: string;
    modal: MODALS;
    getTitle: (item: T) => string;
    getDescription?: (item: T) => string | undefined | null;
}

export function FieldModal<T>({ name, label, modal, getTitle, getDescription }: Props<T>) {
    return (
        <Form.Item label={label} name={name}>
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => {
                    const data = getFieldValue(name) ?? [];

                    return (
                        <List
                            size="small"
                            pagination={false}
                            dataSource={data.map((el: T, i: number) => ({
                                ...el,
                                index: `${i}`,
                            }))}
                            renderItem={(item: T & { id: string }, i: number) => (
                                <ObservedListItem
                                    item={item}
                                    index={i}
                                    getTitle={getTitle}
                                    getDescription={getDescription}
                                    onRemove={(index: number) => {
                                        setFieldValue(
                                            name,
                                            data.filter((el: T, c: number) => c !== index),
                                        );
                                    }}
                                />
                            )}
                            footer={
                                <Button
                                    type="dashed"
                                    block
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        Modal.show(modal, {
                                            mode: WIZARD_MODE.CREATE,
                                            onSubmit: (value: T) => setFieldValue(name, [...data, value]),
                                        });
                                    }}>
                                    Додати
                                </Button>
                            }
                        />
                    );
                }}
            </Form.Item>
        </Form.Item>
    );
}
