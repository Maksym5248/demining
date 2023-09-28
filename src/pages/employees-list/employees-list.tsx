import React from 'react';

import { List, Button, Typography, theme } from 'antd';

import { Icon } from '~/components';
import { str } from '~/utils';

import { s } from './employees-list.styles';
import { mockData } from './mock-data';

const { Text } = Typography;

const { useToken } = theme;

export const EmployeesListPage: React.FC = () => {
  const token = useToken();

  return (
    <List
      css={s.listHeader}
      itemLayout="horizontal"
      dataSource={mockData}
      header={
        <div css={s.test}>
            <Text span="Список особового складу"/>
            <Button icon={<Icon.UserAddOutlined />}/>
        </div>
      }
      renderItem={(item) => (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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



// const { Text, Link } = Typography;

// const App: React.FC = () => (
//   <Space direction="vertical">
//     <Text>Ant Design (default)</Text>
//     <Text type="secondary">Ant Design (secondary)</Text>
//     <Text type="success">Ant Design (success)</Text>
//     <Text type="warning">Ant Design (warning)</Text>
//     <Text type="danger">Ant Design (danger)</Text>
//     <Text disabled>Ant Design (disabled)</Text>
//     <Text mark>Ant Design (mark)</Text>
//     <Text code>Ant Design (code)</Text>
//     <Text keyboard>Ant Design (keyboard)</Text>
//     <Text underline>Ant Design (underline)</Text>
//     <Text delete>Ant Design (delete)</Text>
//     <Text strong>Ant Design (strong)</Text>
//     <Text italic>Ant Design (italic)</Text>
//     <Link href="https://ant.design" target="_blank">
//       Ant Design (Link)
//     </Link>
//   </Space>
// );

// export default App;