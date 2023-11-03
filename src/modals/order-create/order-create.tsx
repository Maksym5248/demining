import React, { useEffect } from 'react';

import { Button, Form, DatePicker, Select, Space, Drawer, InputNumber, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils'

import { s } from './order-create.style'
import { IOrderForm } from './order-create.types';

const { Option } = Select;

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

// initial values
// list
// store

export const OrderCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const store = useStore();

  const order = store.order.orderCollection.get(id);
  const employeesListChief = store.employee.employeesListChief;
  const employeeChiefFirst = employeesListChief[0];

  useEffect(() => {
    store.order.fetchOrders.run();
  }, []);

  const isEdit = !!id;
  const isLoading = !store.order.fetchOrders.isLoaded && store.order.fetchOrders.inProgress;

  const onFinishCreate = async (values: IOrderForm) => {
    await store.order.addOrder.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IOrderForm) => {
    await order.update.run(values);
    hide();
  };

  return (   
      <Drawer
        open={isVisible}
        destroyOnClose
        title={`${isEdit ? "Редагувати": "Створити"} наказ`}
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
            initialValues={order
              ? Object.assign({}, order, {
                signedBy: order.signedBy?.id 
              })
              : {
                number: store.order.orderList.first?.number + 1,
                signedBy: store.order.orderList.first?.signedBy?.id || employeeChiefFirst?.id,
                signedAt: dates.today(),
                }
            }
          >
            <Form.Item
              label="Номер"
              name="number"
              rules={[{ required: true }]}
            >
                <InputNumber size="middle" min={1} max={100000} />
            </Form.Item>
            <Form.Item
              label="Дата підписання"
              name="signedAt"
              rules={[{ required: true, message: 'Обов\'язкове поле' }]}
            >
                <DatePicker/>
            </Form.Item>
            <Form.Item
                label="Підписав"
                name="signedBy"
                rules={[{ required: true, message: 'Обов\'язкове поле' }]}
              >
              <Select>
                {employeesListChief.map(el => (
                  <Option value={el.id} key={el.type}>{el.fullName}</Option>
                ))}
              </Select>
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

