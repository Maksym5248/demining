import React, { useState } from "react";

import { Layout as Lay, Menu, Button, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

import { Icon } from '~/components';

import { s } from './layout.styles';


const { Sider, Content } = Lay;

export const Layout: React.FC = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Lay>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <Icon.UserOutlined />,
              label: 'List reports',
              onClick: () => navigate("/")
            },
            {
              key: '2',
              icon: <Icon.UserOutlined />,
              label: 'Особовий склад',
              onClick: () => navigate("/employees-list")
            },
            {
              key: '3',
              icon: <Icon.UserOutlined style={{ }}/>,
              label: 'List reports',
              onClick: () => navigate("/")
            },
            {
              key: '4',
              icon: <Icon.VideoCameraOutlined />,
              label: 'nav 2',
              onClick: () => navigate("/template")
            },
          ]}
        />
      </Sider>
      <Lay>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 400,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Lay>
    </Lay>
  );
};