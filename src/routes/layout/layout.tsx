import React, { useState } from "react";

import { Layout as Lay, Menu } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';

import { Icon } from '~/components';

import { s } from './layout.styles';


const { Sider, Content } = Lay;

export const Layout: React.FC = () => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Lay style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <Icon.FileTextOutlined />,
              label: 'Cписок актів',
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
              icon: <Icon.DatabaseOutlined />,
              label: 'Статистика',
              onClick: () => navigate("template")
            },
            {
              key: '4',
              icon: <Icon.VideoCameraOutlined />,
              label: 'Налаштування',
              onClick: () => navigate("template")
            },
          ]}
        />
      </Sider>
      <Lay>
        <Content css={s.content}>
          <Outlet />
        </Content>
      </Lay>
    </Lay>
  );
};