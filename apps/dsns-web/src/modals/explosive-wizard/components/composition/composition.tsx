import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, List } from 'antd';
import { observer } from 'mobx-react-lite';
import { type IExplosiveCompositionData } from 'shared-my-client';

import { Icon } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

export interface ListItemProps {
    item: IExplosiveCompositionData;
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
            <List.Item.Meta title={label} description={`${item.percent}%`} />
        </List.Item>
    );
}
const ObservedListItem = observer(ListItem);

export function Сomposition() {
    return (
        <Form.Item label="Склад" name="composition">
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => {
                    const data = getFieldValue('composition') ?? [];

                    return (
                        <List
                            size="small"
                            pagination={false}
                            dataSource={data.map((el: IExplosiveCompositionData, i: number) => ({
                                ...el,
                                index: `${i}`,
                            }))}
                            renderItem={(item: IExplosiveCompositionData & { id: string }, i: number) => (
                                <ObservedListItem
                                    item={item}
                                    index={i}
                                    onRemove={(index: number) => {
                                        setFieldValue(
                                            'composition',
                                            data.filter((el: IExplosiveCompositionData, c: number) => c !== index),
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
                                        Modal.show(MODALS.EXPLOSIVE_COMPOSITION, {
                                            mode: WIZARD_MODE.CREATE,
                                            max:
                                                100 -
                                                data.reduce((acc: number, el: IExplosiveCompositionData) => acc + (el.percent ?? 0), 0),
                                            onSubmit: (value: IExplosiveCompositionData) => setFieldValue('composition', [...data, value]),
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
