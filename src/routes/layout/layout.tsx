import React, { useState } from "react";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout as Lay, Menu, Button, theme } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Lay;
interface ILayoutPros {
  children: React.ReactNode
}

export const Layout: React.FC = ({ children }: ILayoutPros) => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Lay>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'List reports',
              onClick: () => {
                navigate("/")
              }
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
              onClick: () => {
                navigate("/template")
              }
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
              onClick: () => {
                navigate("/form-report1")
              }
            },
          ]}
        />
      </Sider>
      <Lay>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
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