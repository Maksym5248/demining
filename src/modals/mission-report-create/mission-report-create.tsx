import React from 'react';

import { Button, Form, Input, Typography, Space, InputNumber, DatePicker, Drawer } from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils'

import { IEmployeeForm } from './mission-report-create.types';
import { s } from './mission-report-create.styles';

const { Title } = Typography;

// номер акту маю бути за порядком + 1;

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const MissionReportCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const store = useStore();

  const employee = store.employee.employeesCollection.get(id);
  const isEdit = !!id;

  const onFinishCreate = async (values: IEmployeeForm) => {
    await store.employee.addEmployee.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IEmployeeForm) => {
    await employee.update.run(values);
    hide();
  };

  return (
    <Drawer
      open={isVisible}
      destroyOnClose
      title="Створити"
      placement="right"
      width={500}
      onClose={hide}
    >
      <Form
        name="complex-form"
        onFinish={isEdit ? onFinishUpdate : onFinishCreate}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
          <Form.Item
            label="Дата затвердження"
            name="approvedAt"
            rules={[{ required: true, message: 'Дата затвердження є обов\'язковим полем' }]}
          >
                <DatePicker defaultValue={dates.today()} />
          </Form.Item>
          <Form.Item label="Номер" style={{ marginBottom: 0 }}>
                <Form.Item
                  name="number"
                  rules={[{ required: true }]}
                  css={s.number}
                >
                    <InputNumber size="middle" min={1} max={100000} defaultValue={3} />
                </Form.Item>
                <Form.Item
                  name="subNumber"
                  css={s.subNumber}
                >
                    <InputNumber size="middle" min={1} max={100000}/>
              </Form.Item>
          </Form.Item>
          
          <Form.Item
            label="Дата виконання"
            name="executedAt"
            rules={[{ required: true, message: 'Дата виконання є обов\'язковим полем' }]}
          >
                <DatePicker defaultValue={dates.today()}/>
          </Form.Item>
          <Form.Item
              label="Ім'я"
              name="firstName"
              rules={[{ required: true, message: 'Ім\'я є обов\'язковим полем' }]}
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
    </Drawer>
  );
});