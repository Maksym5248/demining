import { useMemo, useState } from 'react';

import { Layout as Lay, Menu, Breadcrumb, Typography, Button, Dropdown } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { Icon } from '~/components';
import { CONFIG } from '~/config';
import { ROUTES } from '~/constants';
import { useNavigate, useStore } from '~/hooks';

import { HEADER_HEIGHT, s } from './layout.styles';
import AppIcon from '../../../assets/icon.svg';
import { nav } from '../../utils/routes';

const { Sider, Content } = Lay;

enum VericalMenu {
    MANAGMENT = 'managment',
    DOCUMENTS = 'documents',
    DICTIONARY = 'dictionary',
}

export const Layout = observer(() => {
    const store = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [collapsed, setCollapsed] = useState(false);
    const { isRootAdmin, isOrganizationAdmin, isOrganizationMember, isAuthor } = store.viewer.user ?? {};

    const [selectedVerticalMenu, setSelectedVerticalMenu] = useState(isAuthor ? VericalMenu.DICTIONARY : VericalMenu.DOCUMENTS);

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
            ...(isRootAdmin
                ? [
                      {
                          key: ROUTES.ORGANIZATIONS_LIST,
                          icon: <Icon.BankOutlined />,
                          label: nav.getRouteTitle(ROUTES.ORGANIZATIONS_LIST),
                          onClick: () => navigate(ROUTES.ORGANIZATIONS_LIST),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [isRootAdmin, isOrganizationAdmin, isOrganizationMember, isAuthor]);

    const menuDocuments = useMemo(() => {
        const arr = [
            ...(isOrganizationAdmin || isOrganizationMember
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
    }, [isRootAdmin, isOrganizationAdmin, isOrganizationMember, isAuthor]);

    const menuDictionary = useMemo(() => {
        const arr = [
            ...(isOrganizationAdmin || isOrganizationMember || isAuthor
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
                  ]
                : []),
            ...(isAuthor
                ? [
                      {
                          key: ROUTES.EXPLOSIVE_LIST,
                          icon: <Icon.FireOutlined />,
                          label: nav.getRouteTitle(ROUTES.EXPLOSIVE_LIST),
                          onClick: () => navigate(ROUTES.EXPLOSIVE_LIST),
                      },
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
    }, [isRootAdmin, isOrganizationAdmin, isOrganizationMember, isAuthor]);

    const menuVertical = useMemo(() => {
        const arr = [
            ...(isOrganizationAdmin || isOrganizationMember
                ? [
                      {
                          key: VericalMenu.DOCUMENTS,
                          icon: <Icon.FileTextOutlined style={{ marginLeft: 10 }} />,
                          label: null,
                          onClick: () => setSelectedVerticalMenu(VericalMenu.DOCUMENTS),
                      },
                  ]
                : []),
            {
                key: VericalMenu.DICTIONARY,
                icon: <Icon.FireOutlined style={{ marginLeft: 10 }} />,
                onClick: () => setSelectedVerticalMenu(VericalMenu.DICTIONARY),
            },
            ...(isRootAdmin
                ? [
                      {
                          key: VericalMenu.MANAGMENT,
                          icon: <Icon.BankOutlined style={{ marginLeft: 10 }} />,
                          onClick: () => setSelectedVerticalMenu(VericalMenu.MANAGMENT),
                      },
                  ]
                : []),
            ...(CONFIG.IS_DEV
                ? [
                      {
                          key: '999',
                          icon: <Icon.DeploymentUnitOutlined />,
                          label: 'DEV',
                          onClick: () => navigate('dev'),
                      },
                  ]
                : []),
        ];

        return arr;
    }, [isRootAdmin, isOrganizationAdmin, isOrganizationMember, isAuthor]);

    const defaultSelectedKeys = useMemo(() => {
        const [, initialRoute] = location.pathname.split('/');
        return [`/${initialRoute}`];
    }, []);

    const currentRoute = nav.getBasePath(location.pathname, params as { [key: string]: string });

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
                                label: store.viewer.user?.data.email,
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
                    {VericalMenu.DOCUMENTS === selectedVerticalMenu && (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={['Documents']}
                            mode="inline"
                            items={menuDocuments}
                        />
                    )}
                    {VericalMenu.DICTIONARY === selectedVerticalMenu && (
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={defaultSelectedKeys}
                            defaultOpenKeys={[ROUTES.EXPLOSIVE_OBJECT_LIST]}
                            mode="inline"
                            items={menuDictionary}
                        />
                    )}
                    {VericalMenu.MANAGMENT === selectedVerticalMenu && (
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
