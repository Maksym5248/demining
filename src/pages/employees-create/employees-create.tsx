import React from 'react';

import { Button, Form, Input, Select, Typography, Space } from 'antd';
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'

import { useStore, useRouteTitle } from '~/hooks'
import { EMPLOYEE_TYPE } from '~/constants';

import { IEmployeeForm } from './employees-create.types';
import { s } from './employees-create.styles';

const { Option } = Select;
const { Title } = Typography;


export const employeeTypesData = [
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

export const EmployeesCreatePage: React.FC = observer(() => {
  const store = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const title = useRouteTitle();

  const employee = store.employee.employeesCollection.get(id);
  const isEdit = !!id;

  const onFinishCreate = async (values: IEmployeeForm) => {
    await store.employee.addEmployee.run(values);
    navigate(-1);
  };

  const onFinishUpdate = async (values: IEmployeeForm) => {
    await employee.update.run(values);
    navigate(-1);
  };

  const ranks = store.employee.ranksList.asArray;

  return (   
    <Form
      name="complex-form"
      onFinish={isEdit ? onFinishUpdate : onFinishCreate}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={employee
        ? Object.assign({}, employee , { rank: employee.rank.id})
        : { type: employeeTypesData[0].name, rank: ranks[0].id }
      }
    >
        <Space css={s.titleContainer}>
            <Title level={4}>{title}</Title>
        </Space>
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
          name={['rank']}
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
          <Button type="primary" htmlType="submit">
            {isEdit ? "Зберегти" : "Додати"} 
          </Button>
        </Form.Item>
    </Form>
  );
});