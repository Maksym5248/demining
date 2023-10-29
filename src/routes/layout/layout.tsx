import React, { useState, } from "react";

import { Layout as Lay, Menu, Breadcrumb } from 'antd';
import { useNavigate, Outlet, useLocation, useParams } from 'react-router-dom';

import { Icon } from '~/components';
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";

import { nav } from "../../utils/routes-info";
import { s } from './layout.styles';

const { Sider, Content } = Lay;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const routes = nav.getRoutes(location.pathname, params);
  const itemsBreadcrumb = routes.map(el => {

    return {
      ...el,
      onClick: () => navigate(el.route, params)
    }
  });
  
  const items = [
    {
      key: '1',
      icon: <Icon.FileTextOutlined />,
      label: nav.getRouteTitle(ROUTES.MISSION_REPORT_LIST),
      onClick: () => navigate("/mission-reports-list")
    },
    {
      key: '2',
      icon: <Icon.UserOutlined />,
      label: nav.getRouteTitle(ROUTES.EMPLOYEES_LIST),
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
  ];

  if(CONFIG.IS_DEV){
    items.push(
      {
        key: '999',
        icon: <Icon.FileTextOutlined />,
        label: 'DEV',
        onClick: () => navigate("dev")
      },
    )
  }

  return (
    <Lay style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          items={items}
        />
      </Sider>
      <Lay>
        <Breadcrumb
          css={s.breadcrumb}
          items={itemsBreadcrumb}
        />
        <Content css={s.content}>
          <Outlet />
        </Content>
      </Lay>
    </Lay>
  );
};