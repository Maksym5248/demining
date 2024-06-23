import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react';
import { type IExplosiveActionDataParams } from 'shared-my-client/stores';

import { Icon, List } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';

import { s } from './explosive-action.styles';
import { type ListItemProps } from './explosive-action.types';

function ListItem({ item, index, onRemove }: ListItemProps) {
    const store = useStore();
    const _onRemove = () => onRemove?.(index);

    const explosive = store.explosive.collectionActions.get(item?.id ?? '') || store.explosive.collection.get(item.explosiveId);

    const weight = item?.weight ? `${item?.weight}кг;` : null;
    const quantity = item?.quantity ? `${item?.quantity} од.;` : null;

    return (
        <List.Item actions={[<Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: 'red' }} />} onClick={_onRemove} />]}>
            <List.Item.Meta title={`${explosive?.data.name}; ${item?.weight ? weight : quantity} `} />
        </List.Item>
    );
}

const ObservedListItem = observer(ListItem);

function Component() {
    return (
        <Form.Item label="ВР та ЗП" name="explosiveActions" css={s.item}>
            <Form.Item noStyle shouldUpdate={() => true}>
                {({ getFieldValue, setFieldValue }) => {
                    const data = getFieldValue('explosiveActions');

                    return (
                        <List
                            size="small"
                            pagination={false}
                            dataSource={data.map((el: IExplosiveActionDataParams, i: number) => ({
                                ...el,
                                index: `${i}`,
                            }))}
                            renderItem={(item: IExplosiveActionDataParams & { id: string }, i: number) => (
                                <ObservedListItem
                                    item={item}
                                    index={i}
                                    onRemove={(index: number) => {
                                        setFieldValue(
                                            'explosiveActions',
                                            data.filter((el: IExplosiveActionDataParams, c: number) => c !== index),
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
                                        Modal.show(MODALS.EXPLOSIVE_ACTION_WIZARD, {
                                            mode: WIZARD_MODE.CREATE,
                                            onSubmit: (value: IExplosiveActionDataParams) =>
                                                setFieldValue('explosiveActions', [...data, value]),
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

export const ExplosiveAction = Component;
