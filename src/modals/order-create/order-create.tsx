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

export const OrderCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const { order, employee } = useStore();

  const currentOrder = order.collection.get(id);
  const {employeesListChief} = employee;
  const employeeChiefFirst = employeesListChief[0];

  useEffect(() => {
    order.fetchList.run();
    employee.fetchList.run();
  }, []);

  const isEdit = !!id;
  const isLoading = (!order.fetchList.isLoaded && order.fetchList.inProgress) || (!order.fetchList.isLoaded && order.fetchList.inProgress);

  const onFinishCreate = async (values: IOrderForm) => {
    await order.add.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IOrderForm) => {
    await currentOrder.update.run(values);
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
            initialValues={currentOrder
              ? ({ ...currentOrder, signedById: currentOrder.signedBy?.employeeId})
              : {
                number: (order.list.first?.number ?? 0) + 1,
                signedById: order.list.first?.signedBy.employeeId || employeeChiefFirst?.id,
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
                name="signedById"
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

