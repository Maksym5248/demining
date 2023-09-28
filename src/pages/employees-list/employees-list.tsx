import React from 'react';

import { List, Button, Typography, Space } from 'antd';

import { Icon } from '~/components';
import { str } from '~/utils';

import { s } from './employees-list.styles';
import { mockData } from './mock-data';

const { Title } = Typography;

export const EmployeesListPage: React.FC = () => {

  return (
    <List
      itemLayout="horizontal"
      dataSource={mockData}
      header={
        <Space css={s.listHeader}>
            <Title level={4}>Список особового складу</Title>
            <Button icon={<Icon.UserAddOutlined />}/>
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
              description={`${item.position}${item.rank.fullName}`}
            >
              </List.Item.Meta>
        </List.Item>
      )}
    />
  );
};