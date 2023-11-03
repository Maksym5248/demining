import React from 'react';

import { Button, Form, Input, Select, Space , Drawer} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { EMPLOYEE_TYPE } from '~/constants';

import { IEmployeeForm } from './employees-create.types';

const { Option } = Select;


const employeeTypesData = [
  {
      type: EMPLOYEE_TYPE.WORKER,
      name: 'Підлеглий',
  },
  {
      type: EMPLOYEE_TYPE.SQUAD_LEAD,
      name: 'Керівник розрахунку на виїзд',
  },
  {
      type: EMPLOYEE_TYPE.CHIEF,
      name: 'Керівник підрозділу',
  },
]


interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const EmployeesCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
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

  const ranks = store.employee.ranksList.asArray;

  return (   
      <Drawer
        open={isVisible}
        destroyOnClose
        title={`${isEdit ? "Редагувати": "Створити"} особовий склад`}
        placement="right"
        width={500}
        onClose={hide}
      >
        <Form
            name="complex-form"
            onFinish={isEdit ? onFinishUpdate : onFinishCreate}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={employee
              ? Object.assign({}, employee , { rank: employee.rank?.id})
              : { type: employeeTypesData[0]?.type, rank: store.employee.ranksList.first?.id }
            }
          >
            <Form.Item
              label="Прізвище"
              name="lastName"
              rules={[{ required: true, message: 'Прізвище є обов\'язковим полем' }]}
            >
              <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
                label="Ім'я"
                name="firstName"
                rules={[{ required: true, message: 'Ім\'я є обов\'язковим полем' }]}
              >
                <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
                label="По-батькові"
                name="surname"
                rules={[{ required: true, message: 'По-батькові є обов\'язковим полем' }]}
              >
                <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
              label="Спеціальне звання"
              name="rank"
              rules={[{ required: true, message: 'Спеціальне звання є обов\'язковим полем' }]}
            >
              <Select>
                {ranks.map(el => (
                  <Option value={el.id} key={el.id}>{el.fullName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
                label="Посада"
                name="position"
                rules={[{ required: true, message: 'Посада є обов\'язковим полем' }]}
              >
                <Input placeholder="Введіть дані" />
            </Form.Item>
            <Form.Item
                label="Тип посади"
                name="type"
                rules={[{ required: true, message: 'Тип посади є обов\'язковим полем' }]}
              >
              <Select>
                {employeeTypesData.map(el => (
                  <Option value={el.type} key={el.type}>{el.name}</Option>
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
     </Drawer>
  );
});

