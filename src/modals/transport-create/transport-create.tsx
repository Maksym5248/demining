import { useEffect } from 'react';

import { Button, Form, Select, Space, Drawer, Input, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { TRANSPORT_TYPE } from "~/constants"
import { useStore } from '~/hooks'

import { s } from './transport-create.style'
import { ITransportForm } from './transport-create.types';

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

const typeOptions = [{
  label: "Для перевезення о/c",
  value: TRANSPORT_TYPE.FOR_HUMANS
}, {
  label: "Для перевезення ВНП",
  value: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS
}]

export const TransportCreateModal = observer(({ id, isVisible, hide }: Props) => {
  const store = useStore();

  const transport = store.transport.collection.get(id ?? "");

  useEffect(() => {
    store.transport.fetchList.run();
  }, []);

  const isEdit = !!id;
  const isLoading = !store.transport.fetchList.isLoaded && store.transport.fetchList.inProgress;

  const onFinishCreate = async (values: ITransportForm) => {
    await store.transport.add.run(values);
    hide();
  };

  const onFinishUpdate = async (values: ITransportForm) => {
    await transport.update.run(values);
    hide();
  };

  return (   
      <Drawer
        open={isVisible}
        destroyOnClose
        title={`${isEdit ? "Редагувати": "Створити"} транспорт`}
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
            initialValues={transport
              ? ({ ...transport})
              : {  type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS }
            }
          >
             <Form.Item
              label="Назва"
              name="name"
              rules={[{ required: true, message: 'Прізвище є обов\'язковим полем' }]}
            >
              <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
              label="Номер автомобіля"
              name="number"
              rules={[{ required: true, message: 'Прізвище є обов\'язковим полем' }]}
            >
              <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
                label="Тип"
                name="type"
                rules={[{ required: true, message: 'Обов\'язкове поле' }]}
              >
              <Select
                options={typeOptions}
              />
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

