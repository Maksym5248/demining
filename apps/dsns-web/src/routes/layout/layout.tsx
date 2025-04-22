import { useMemo, useState } from 'react';

import { Layout as Lay, Menu, Breadcrumb, Typography, Button, Dropdown } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { Icon } from '~/components';
import { CONFIG } from '~/config';
import { ROUTES, routesGroups, SECTION } from '~/constants';
import { useNavigate, useStore } from '~/hooks';

import { HEADER_HEIGHT, s } from './layout.styles';
import AppIcon from '../../../assets/icon.svg';
import { nav } from '../../utils/routes';

const { Sider, Content } = Lay;

export const Layout = observer(() => {
    const store = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [collapsed, setCollapsed] = useState(false);
    const { permissions, user } = store.viewer ?? {};

    const routes = nav.getRoutes(location.pathname, params as { [key: string]: string });
    const itemsBreadcrumb = routes.map(el => ({
        ...el,
        onClick: () => navigate(el.route, params),
    }));

    const onSignOut = async () => {
        await store.auth.signInOut.run();
        navigate(ROUTES.LOGIN);
    };

    const menuManagment = useMemo(() => {
        const arr = [
            ...(permissions?.managment.view()
                ? [
                      {
                          key: ROUTES.ORGANIZATIONS_LIST,
                          icon: <Icon.BankOutlined />,
                          label: nav.getRouteTitle(ROUTES.ORGANIZATIONS_LIST),
                          onClick: () => navigate(ROUTES.ORGANIZATIONS_LIST),
                      },
                      {
                          key: ROUTES.USERS_LIST,
                          icon: <Icon.UserOutlined />,
                          label: nav.getRouteTitle(ROUTES.USERS_LIST),
                          onClick: () => navigate(ROUTES.USERS_LIST),
                      },
                  ]
                : []),
            ...(permissions?.managment.viewOrganization()
                ? [
                      {
                          key: ROUTES.MEMBERS_LIST,
                          icon: <Icon.UserOutlined />,
                          label: nav.getRouteTitle(ROUTES.MEMBERS_LIST),
                          onClick: () => navigate(ROUTES.MEMBERS_LIST.replace(':organizationId', user?.data.organization?.id ?? '')),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [permissions?.managment.view(), permissions?.managment.viewOrganization(), user?.data.organization?.id]);

    console.log('user?.data.organization?.id', user?.data);

    const menuDocuments = useMemo(() => {
        const arr = [
            ...(permissions?.documents.view()
                ? [
                      {
                          key: ROUTES.HOME,
                          icon: <Icon.HomeOutlined />,
                          label: nav.getRouteTitle(ROUTES.HOME),
                          onClick: () => navigate(ROUTES.HOME),
                      },
                      {
                          key: 'Documents',
                          icon: <Icon.FileTextOutlined />,
                          label: 'Документи',
                          children: [
                              {
                                  key: ROUTES.TEMPLATES,
                                  icon: <Icon.FileTextOutlined />,
                                  label: nav.getRouteTitle(ROUTES.TEMPLATES),
                                  onClick: () => navigate(ROUTES.TEMPLATES),
                              },
                              {
                                  key: ROUTES.MISSION_REPORT_LIST,
                                  icon: <Icon.FileTextOutlined />,
                                  label: nav.getRouteTitle(ROUTES.MISSION_REPORT_LIST),
                                  onClick: () => navigate(ROUTES.MISSION_REPORT_LIST),
                              },
                              {
                                  key: ROUTES.MISSION_REQUEST_LIST,
                                  icon: <Icon.FileExclamationOutlined />,
                                  label: nav.getRouteTitle(ROUTES.MISSION_REQUEST_LIST),
                                  onClick: () => navigate(ROUTES.MISSION_REQUEST_LIST),
                              },
                              {
                                  key: ROUTES.ORDER_LIST,
                                  icon: <Icon.FileTextOutlined />,
                                  label: nav.getRouteTitle(ROUTES.ORDER_LIST),
                                  onClick: () => navigate(ROUTES.ORDER_LIST),
                              },
                          ],
                      },
                      {
                          key: ROUTES.STATISTICS,
                          icon: <Icon.LineChartOutlined />,
                          label: nav.getRouteTitle(ROUTES.STATISTICS),
                          onClick: () => navigate(ROUTES.STATISTICS),
                      },
                      {
                          key: ROUTES.EMPLOYEES_LIST,
                          icon: <Icon.TeamOutlined />,
                          label: nav.getRouteTitle(ROUTES.EMPLOYEES_LIST),
                          onClick: () => navigate(ROUTES.EMPLOYEES_LIST),
                      },
                      {
                          key: ROUTES.TRANSPORT_LIST,
                          icon: <Icon.CarOutlined />,
                          label: nav.getRouteTitle(ROUTES.TRANSPORT_LIST),
                          onClick: () => navigate(ROUTES.TRANSPORT_LIST),
                      },
                      {
                          key: ROUTES.EQUIPMENT_LIST,
                          icon: <Icon.ToolOutlined />,
                          label: nav.getRouteTitle(ROUTES.EQUIPMENT_LIST),
                          onClick: () => navigate(ROUTES.EQUIPMENT_LIST),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [permissions?.documents.view()]);

    const menuDictionary = useMemo(() => {
        const arr = [
            ...(permissions?.dictionary.viewManagement()
                ? [
                      {
                          key: ROUTES.EXPLOSIVE_OBJECT_LIST,
                          icon: <Icon.FireOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_OBJECT_LIST),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_LIST),
                      },
                      {
                          key: ROUTES.EXPLOSIVE_DEVICE_LIST,
                          icon: <Icon.CodeSandboxOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_DEVICE_LIST),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_DEVICE_LIST),
                      },
                      {
                          key: ROUTES.EXPLOSIVE_LIST,
                          icon: <Icon.FireOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_LIST),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_LIST),
                      },
                  ]
                : []),
            ...(permissions?.dictionary.edit()
                ? [
                      {
                          key: ROUTES.EXPLOSIVE_OBJECT_TYPE,
                          icon: <Icon.ApartmentOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_OBJECT_TYPE),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_TYPE),
                      },
                      {
                          key: ROUTES.EXPLOSIVE_OBJECT_CLASS,
                          icon: <Icon.AlignLeftOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_OBJECT_CLASS),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_CLASS),
                      },

                      {
                          key: ROUTES.BOOKS_LIST,
                          icon: <Icon.BookOutlined />,
                          label: nav.getRouteTitle(ROUTES.BOOKS_LIST),
                          onClick: () => navigate(ROUTES.BOOKS_LIST),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [permissions?.dictionary.edit(), permissions?.dictionary.viewManagement()]);

    const menuVertical = useMemo(() => {
        const arr = [
            ...(permissions?.documents.view()
                ? [
                      {
                          key: SECTION.DOCUMENTS,
                          icon: <Icon.FileTextOutlined style={{ marginLeft: 10 }} />,
                          label: null,
                          onClick: () => navigate(ROUTES.HOME),
                      },
                  ]
                : []),
            ...(permissions?.dictionary.viewManagement()
                ? [
                      {
                          key: SECTION.DICTIONARY,
                          icon: <Icon.FireOutlined style={{ marginLeft: 10 }} />,
                          onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_LIST),
                      },
                  ]
                : []),
            ...(permissions?.managment.view() || permissions?.managment.viewOrganization()
                ? [
                      {
                          key: SECTION.MANAGMENT,
                          icon: <Icon.BankOutlined style={{ marginLeft: 10 }} />,
                          onClick: () => navigate(ROUTES.MEMBERS_LIST.replace(':organizationId', user?.data.organization?.id ?? '')),
                      },
                  ]
                : []),
            ...(CONFIG.IS_DEV
                ? [
                      {
                          key: SECTION.DEV,
                          icon: <Icon.DeploymentUnitOutlined />,
                          label: 'DEV',
                          onClick: () => navigate(ROUTES.DEV),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [permissions?.managment.view(), permissions?.documents.view()]);

    const defaultSelectedKeys = useMemo(() => {
        const [, initialRoute] = location.pathname.split('/');
        return [`/${initialRoute}`];
    }, [location.pathname]);

    const currentRoute = nav.getBasePath(location.pathname, params as { [key: string]: string });

    let selectedVerticalMenu = SECTION.DICTIONARY;

    if (routesGroups[SECTION.DOCUMENTS].includes(currentRoute)) {
        selectedVerticalMenu = SECTION.DOCUMENTS;
    } else if (routesGroups[SECTION.MANAGMENT].includes(currentRoute)) {
        selectedVerticalMenu = SECTION.MANAGMENT;
    } else if (routesGroups[SECTION.DEV].includes(currentRoute)) {
        selectedVerticalMenu = SECTION.DEV;
    }

    return (
        <Lay>
            <Header css={s.header}>
                <div css={s.logo}>
                    <AppIcon css={s.appIcon} />
                    <Typography.Title level={5} css={s.appName} style={{ color: '#FFF' }}>
                        {CONFIG.APP_NAME_TRANSLATION}
                    </Typography.Title>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={menuVertical}
                    style={{ flex: 1, minWidth: 0 }}
                    selectedKeys={[selectedVerticalMenu]}
                />
                <Dropdown
                    menu={{
                        items: [
                            {
                                label: store.viewer.user?.data.info.email,
                                key: 'email',
                            },
                            {
                                label: 'Вийти',
                                key: 'logout',
                                icon: <Icon.LogoutOutlined />,
                                onClick: onSignOut,
                            },
                        ],
                    }}
                    trigger={['click']}>
                    <Button shape="circle" icon={<Icon.UserOutlined />} />
                </Dropdown>
            </Header>
            <Lay>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={value => setCollapsed(value)}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: HEADER_HEIGHT,
                        bottom: 0,
                    }}>
                    <div className="demo-logo-vertical" />
                    {SECTION.DOCUMENTS === selectedVerticalMenu && (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={['Documents']}
                            mode="inline"
                            items={menuDocuments}
                        />
                    )}
                    {SECTION.DICTIONARY === selectedVerticalMenu && (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={[ROUTES.EXPLOSIVE_OBJECT_LIST]}
                            mode="inline"
                            items={menuDictionary}
                        />
                    )}
                    {SECTION.MANAGMENT === selectedVerticalMenu && (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={[ROUTES.ORGANIZATIONS_LIST]}
                            mode="inline"
                            items={menuManagment}
                        />
                    )}
                </Sider>
                <Lay
                    style={{
                        marginLeft: collapsed ? 74 : 200,
                        display: 'flex',
                        flex: 1,
                    }}>
                    {currentRoute === ROUTES.HOME && <Outlet />}
                    {currentRoute !== ROUTES.HOME && (
                        <>
                            <Breadcrumb css={s.breadcrumb} items={itemsBreadcrumb} />
                            <Content css={s.content}>
                                <Outlet />
                            </Content>
                        </>
                    )}
                </Lay>
            </Lay>
        </Lay>
    );
});
