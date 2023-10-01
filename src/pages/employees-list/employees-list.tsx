import React from 'react';

import { List, Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { Icon } from '~/components';
import { str } from '~/utils';

import { s } from './employees-list.styles';
import { mockData } from './mock-data';

const { Title, Text } = Typography;

export const EmployeesListPage: React.FC = () => {
  const navigate = useNavigate();

  const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
    console.log('TEST')
    e.preventDefault();
    navigate('/employees-list/create')
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={mockData}
      header={
        <Space css={s.listHeader}>
            <Title level={4}>Список особового складу</Title>
            <Button icon={<Icon.UserAddOutlined />} onClick={onGoToEmployeesCreate}/>
        </Space>
      }
      renderItem={(item) => (
        <List.Item
          actions={[
           <Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>}/>,
           <Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
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
      )}
    />
  );
};