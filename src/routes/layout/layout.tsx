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
      key: ROUTES.MISSION_REPORT_LIST,
      icon: <Icon.FileTextOutlined />,
      label: nav.getRouteTitle(ROUTES.MISSION_REPORT_LIST),
      onClick: () => navigate(ROUTES.MISSION_REPORT_LIST)
    },
        {
      key: ROUTES.MISSION_REQUEST_LIST,
      icon: <Icon.FileTextOutlined />,
      label: nav.getRouteTitle(ROUTES.MISSION_REQUEST_LIST),
      onClick: () => navigate(ROUTES.MISSION_REQUEST_LIST)
    },
    {
      key: ROUTES.ORDER_LIST,
      icon: <Icon.FileTextOutlined />,
      label: nav.getRouteTitle(ROUTES.ORDER_LIST),
      onClick: () => navigate(ROUTES.ORDER_LIST)
    },
    {
      key: ROUTES.EXPLOSIVE_OBJECT_LIST,
      icon: <Icon.FireOutlined />,
      label: nav.getRouteTitle(ROUTES.EXPLOSIVE_OBJECT_LIST),
      onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_LIST)
    },
    {
      key: ROUTES.EMPLOYEES_LIST,
      icon: <Icon.UserOutlined />,
      label: nav.getRouteTitle(ROUTES.EMPLOYEES_LIST),
      onClick: () => navigate(ROUTES.EMPLOYEES_LIST)
    },
    // {
    //   key: '4',
    //   icon: <Icon.DatabaseOutlined />,
    //   label: 'Статистика',
    //   onClick: () => navigate("template")
    // },
    {
      key: '5',
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
          defaultSelectedKeys={[ROUTES.MISSION_REPORT_LIST]}
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