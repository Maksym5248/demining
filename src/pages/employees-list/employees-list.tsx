import React, { useEffect } from 'react';

import { List, Button, Typography, Space, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';

import { IEmployee } from '~/stores';
import { Icon } from '~/components';
import { str } from '~/utils';
import { useStore } from '~/hooks';

import { s } from './employees-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IEmployee}) => {
  const store = useStore();
  const navigate = useNavigate();

  const onGoToEmployeesEdit = (id:string) => (e:React.SyntheticEvent) => {
    e.preventDefault();
    navigate(`/employees-list/edit/${id}`)
  };

  const onRemove = (id:string) => (e: React.MouseEvent<HTMLElement>) => {
    store.employee.removeEmployee.run(id);
  };
  
  const onCancel = (e: React.MouseEvent<HTMLElement>) => {
    message.error('Скасовано');
  };

  return (
    <List.Item
      actions={[
       <Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoToEmployeesEdit(item.id)}/>,
       <Popconfirm
          title="Видалити"
          description="Ви впевнені, після цього дані не можливо відновити ?"
          onConfirm={onRemove(item.id)}
          onCancel={onCancel}
          okText="Так"
          cancelText="Ні"
        >
          <Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
        </Popconfirm>
      ]}
    >
        <List.Item.Meta
          avatar={<Icon.UserOutlined />}
          title={str.getFullName(item)}
          description={
            <Space css={s.listItemDesc}>
                <Text type="secondary">{str.upperFirst(item.rank.fullName)}</Text>
                <Text type="secondary">{str.upperFirst(item.position)}</Text>
            </Space>
          }
        >
          </List.Item.Meta>
    </List.Item>
  )
});

export const EmployeesListPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const store = useStore();

  const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
    e.preventDefault();
    navigate('/employees-list/create')
  };

  useEffect(() => {
    store.employee.fetchEmployees.run();
  }, []);

  return (
    <List
      rowKey="id"
      itemLayout="horizontal"
      loading={store.employee.fetchEmployees.inProgress}
      dataSource={store.employee.employeesList.asArray}
      header={
        <Space css={s.listHeader}>
            <Title level={4}>Список особового складу</Title>
            <Button icon={<Icon.UserAddOutlined />} onClick={onGoToEmployeesCreate}/>
        </Space>
      }
      renderItem={(item) => <ListItem item={item}/>}
    />
  );
});