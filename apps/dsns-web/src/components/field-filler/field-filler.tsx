import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, List } from 'antd';
import { observer } from 'mobx-react-lite';
import { type IFillerData } from 'shared-my-client';

import { Icon } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

export interface ListItemProps {
    item: IFillerData;
    index: number;
    onRemove: (index: number) => void;
}

function ListItem({ item, index, onRemove }: ListItemProps) {
    const store = useStore();
    const _onRemove = () => onRemove?.(index);

    const explosive = store.explosive.collection.get(item?.explosiveId ?? '');
    const label = explosive?.displayName ?? item.name;

    return (
        <List.Item actions={[<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: 'red' }} />} onClick={_onRemove} />]}>
            <List.Item.Meta title={label} description={`${item.weight} кг`} />
        </List.Item>
    );
}
const ObservedListItem = observer(ListItem);

interface Props {
    label: string;
    name: string;
}

export function FieldFiller({ name, label }: Props) {
    return (
        <Form.Item label={label} name={name}>
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => {
                    const data = getFieldValue('filler') ?? [];

                    return (
                        <List
                            size="small"
                            pagination={false}
                            dataSource={data.map((el: IFillerData, i: number) => ({
                                ...el,
                                index: `${i}`,
                            }))}
                            renderItem={(item: IFillerData & { id: string }, i: number) => (
                                <ObservedListItem
                                    item={item}
                                    index={i}
                                    onRemove={(index: number) => {
                                        setFieldValue(
                                            'filler',
                                            data.filter((el: IFillerData, c: number) => c !== index),
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
                                        Modal.show(MODALS.EXPLOSIVE_OBJECT_FILLER, {
                                            mode: WIZARD_MODE.CREATE,
                                            onSubmit: (value: IFillerData) => setFieldValue('filler', [...data, value]),
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
