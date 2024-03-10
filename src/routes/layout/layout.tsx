import { useMemo, useState } from "react";

import { Layout as Lay, Menu, Breadcrumb } from 'antd';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";

import { Icon } from '~/components';
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";
import { useNavigate, useStore } from "~/hooks";

import { nav } from "../../utils/routes-info";
import { s } from './layout.styles';

const { Sider, Content } = Lay;

export const Layout = observer(() => {
	const store = useStore();
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	const [collapsed, setCollapsed] = useState(false);

	const routes = nav.getRoutes(location.pathname, params as {[key:string]: string});
	const itemsBreadcrumb = routes.map(el => ({
		...el,
		onClick: () => navigate(el.route, params)
	}));
  
	const { isRootAdmin, isOrganizationAdmin, isOrganizationMember } = store.viewer.user ?? {};

	const items = useMemo(() => {
		const arr = [
			...((isOrganizationAdmin || isOrganizationMember) ? [
				{
					key: "Documents",
					icon: <Icon.FileTextOutlined />,
					label: "Документи",
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
							onClick: () => navigate(ROUTES.MISSION_REQUEST_LIST)
						},
						{
							key: ROUTES.ORDER_LIST,
							icon: <Icon.FileTextOutlined />,
							label: nav.getRouteTitle(ROUTES.ORDER_LIST),
							onClick: () => navigate(ROUTES.ORDER_LIST)
						},
					]
				},
				{
					key: ROUTES.EXPLOSIVE_OBJECT_LIST,
					icon: <Icon.FireOutlined />,
					label: nav.getRouteTitle(ROUTES.EXPLOSIVE_OBJECT_LIST),
					onClick: () => navigate(ROUTES.EXPLOSIVE_OBJECT_LIST)
				},
				{
					key: ROUTES.EMPLOYEES_LIST,
					icon: <Icon.TeamOutlined />,
					label: nav.getRouteTitle(ROUTES.EMPLOYEES_LIST),
					onClick: () => navigate(ROUTES.EMPLOYEES_LIST)
				},
				{
					key: ROUTES.TRANSPORT_LIST,
					icon: <Icon.CarOutlined />,
					label: nav.getRouteTitle(ROUTES.TRANSPORT_LIST),
					onClick: () => navigate(ROUTES.TRANSPORT_LIST)
				},
				{
					key: ROUTES.EQUIPMENT_LIST,
					icon: <Icon.ToolOutlined />,
					label: nav.getRouteTitle(ROUTES.EQUIPMENT_LIST),
					onClick: () => navigate(ROUTES.EQUIPMENT_LIST)
				},
			] : []),
			...(isRootAdmin ? [
				{
					key: ROUTES.ORGANIZATIONS_LIST,
					icon: <Icon.BankOutlined />,
					label: nav.getRouteTitle(ROUTES.ORGANIZATIONS_LIST),
					onClick: () => navigate(ROUTES.ORGANIZATIONS_LIST)
				},
			]: []),
			...(isOrganizationAdmin ? [
				{
					key: ROUTES.MY_ORGANIZATION,
					icon: <Icon.TeamOutlined />,
					label: nav.getRouteTitle(ROUTES.MY_ORGANIZATION),
					onClick: () => navigate(ROUTES.MY_ORGANIZATION)
				},
			]: []),
			{
				key: '5',
				icon: <Icon.SettingOutlined />,
				label: 'Налаштування',
				onClick: () => navigate(ROUTES.SETTINGS)
			},
		];

		if(CONFIG.IS_DEV){
			arr.push(
				{
					key: '999',
					icon: <Icon.DeploymentUnitOutlined />,
					label: 'DEV',
					onClick: () => navigate("dev")
				},
			)
		}

		return arr;
	}, [isRootAdmin, isOrganizationAdmin, isOrganizationMember]);

	const defaultSelectedKeys = useMemo(() => {
		const [, initialRoute]=location.pathname.split("/");
		return [`/${initialRoute}`];
	}, [])

	return (
		<Lay hasSider>
			<Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}>
				<div className="demo-logo-vertical" />
				<Menu
					theme="dark"
					defaultSelectedKeys={defaultSelectedKeys}
					defaultOpenKeys={["Documents"]}
					mode="inline"
					items={items}
				/>
			</Sider>
			<Lay style={{ marginLeft: collapsed ? 74 : 200, display: "flex", flex: 1, height: "100vh" }}>
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
})