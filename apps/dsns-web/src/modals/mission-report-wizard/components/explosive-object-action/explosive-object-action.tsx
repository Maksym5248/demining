import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react';
import { type IExplosiveObjectActionDataParams } from 'shared-my-client/stores';

import { Icon, List } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { s } from './explosive-object-action.styles';
import { type ListItemProps } from './explosive-object-action.types';

const getIcon = (isDone: boolean) => (isDone ? '+' : '-');

function ListItem({ item, index, onRemove }: ListItemProps) {
    const store = useStore();
    const _onRemove = () => onRemove?.(index);

    const explosiveObject =
        store.explosiveObject.collectionActions.get(item?.id ?? '')?.explosiveObject ||
        store.explosiveObject.collection.get(item.explosiveObjectId);

    return (
        <List.Item actions={[<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: 'red' }} />} onClick={_onRemove} />]}>
            <List.Item.Meta
                title={`${explosiveObject?.fullDisplayName}; Категорія: ${item.category}; ${item.quantity} од.`}
                description={`Виявлено ${getIcon(item.isDiscovered)}; Транспортовано ${getIcon(item.isTransported)}; Знищено ${getIcon(item.isDestroyed)}: `}
            />
        </List.Item>
    );
}

const ObservedListItem = observer(ListItem);

function Component() {
    return (
        <Form.Item label="ВНП" name="explosiveObjectActions" rules={[{ required: true, message: "Є обов'язковим полем" }]} css={s.item}>
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => {
                    const data = getFieldValue('explosiveObjectActions');

                    return (
                        <List
                            size="small"
                            pagination={false}
                            dataSource={data.map((el: IExplosiveObjectActionDataParams, i: number) => ({
                                ...el,
                                index: `${i}`,
                            }))}
                            renderItem={(item: IExplosiveObjectActionDataParams & { id: string }, i: number) => (
                                <ObservedListItem
                                    item={item}
                                    index={i}
                                    onRemove={(index: number) => {
                                        setFieldValue(
                                            'explosiveObjectActions',
                                            data.filter((el: IExplosiveObjectActionDataParams, c: number) => c !== index),
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
                                        Modal.show(MODALS.EXPLOSIVE_OBJECT_ACTION_WIZARD, {
                                            mode: WIZARD_MODE.CREATE,
                                            onSubmit: (value: IExplosiveObjectActionDataParams) =>
                                                setFieldValue('explosiveObjectActions', [...data, value]),
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

export const ExplosiveObjectAction = Component;
