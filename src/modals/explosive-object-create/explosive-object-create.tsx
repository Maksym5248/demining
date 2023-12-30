import React, { useEffect } from 'react';

import { Button, Form, Input, Space, Drawer, InputNumber, Spin, Select} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'

import { s } from './explosive-object-create.style'
import { IExplosiveObjectForm } from './explosive-object-create.types';

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const ExplosiveObjectCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const { explosiveObject } = useStore();

  const currentExplosiveObject = explosiveObject.collection.get(id);

  useEffect(() => {
    explosiveObject.fetchListTypes.run();
  }, []);

  const isEdit = !!id;
  const isLoading = explosiveObject.fetchListTypes.inProgress;
  const firstType = explosiveObject.listTypes.first;

  const onFinishCreate = async (values: IExplosiveObjectForm) => {
    await explosiveObject.add.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IExplosiveObjectForm) => {
    await currentExplosiveObject.update.run(values);
    hide();
  };

  return (   
      <Drawer
        open={isVisible}
        destroyOnClose
        title={`${isEdit ? "Редагувати": "Створити"} ВНП`}
        placement="right"
        width={500}
        onClose={hide}
      >
        { isLoading
         ? (<Spin css={s.spin} />)
         : (
          <Form
            name="complex-form"
            onFinish={isEdit ? onFinishUpdate : onFinishCreate}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={currentExplosiveObject
              ? ({typeId: currentExplosiveObject?.type?.id, ...currentExplosiveObject})
              : {
                typeId: firstType?.id
              }
            }
          >
           <Form.Item
                label="Тип"
                name="typeId"
                rules={[{ required: true, message: 'Обов\'язкове поле' }]}
              >
              <Select
                options={explosiveObject.sortedListTypes.map((el) => ({ label: el.fullName, value: el.id }))}
              />
            </Form.Item>
            <Form.Item
              label="Калібр"
              name="caliber"
            >
                <InputNumber size="middle" min={1} max={100000} />
            </Form.Item>
            <Form.Item
              label="Назва"
              name="name"
              rules={[{ message: 'Прізвище є обов\'язковим полем' }]}
            >
              <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item label=" " colon={false}>
                <Space>
                    <Button onClick={hide}>Скасувати</Button>
                    <Button htmlType="submit" type="primary">
                      {isEdit ? "Зберегти" : "Додати"}
                    </Button>
                </Space>
            </Form.Item>
          </Form>
        )}
     </Drawer>
  );
});

