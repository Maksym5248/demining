import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { observer } from 'mobx-react-lite';
import { useSelectStore } from 'shared-my-client';

import { SelectAsync } from '~/components';
import { useStore } from '~/hooks';
import { select } from '~/utils';

function Component() {
    const { explosiveObject } = useStore();
    const explosiveProps = useSelectStore({
        ...explosiveObject,
        list: explosiveObject.listFuse,
        fetchList: explosiveObject.fetchListFuse,
        fetchMoreList: explosiveObject.fetchMoreListFuse,
    });

    return (
        <Form.Item label="Підривники" name="fuseIds">
            <Form.List name="fuseIds">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Form.Item key={key} noStyle shouldUpdate={() => true}>
                                {({ getFieldValue }) => {
                                    const fuseIds = getFieldValue('fuseIds');

                                    const currentSelectedId = fuseIds[name];
                                    const selected = explosiveObject.collection.get(currentSelectedId);

                                    return (
                                        <Form.Item name={name} {...restField}>
                                            <SelectAsync
                                                {...explosiveProps}
                                                options={select.append(
                                                    explosiveObject.listFuse.asArray
                                                        .filter(el => !fuseIds.includes(el.data.id))
                                                        .map(el => ({
                                                            label: el?.displayName,
                                                            value: el.data.id,
                                                        })),
                                                    {
                                                        label: selected?.displayName,
                                                        value: selected?.id,
                                                    },
                                                )}
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

export const Fuse = observer(Component);
