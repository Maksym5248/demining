import { useMemo } from "react";

import {
	Navigate,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { observer } from "mobx-react";
import { Spin } from "antd";

import {
	MissionReportsListPage,
	OrdersListPage,
	MissionRequestListPage, 
	ErrorNotFoundPage,
	EmployeesListPage,
	ExplosiveObjectListPage,
	TransportListPage,
	EquipmentListPage,
	SignupPage,
	DevPage,
	SettingsPage,
	LoginPage,
	WaitingApprovePage,
	OrganizationsListPage
} from "~/pages"
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";
import { useStore } from "~/hooks";

import { Layout } from "./layout"

const mainRoutes = [
	{	
		path: ROUTES.MISSION_REPORT_LIST,
		Component: MissionReportsListPage,
	},
	{
		path: ROUTES.MISSION_REQUEST_LIST,
		Component: MissionRequestListPage,
	},
	{
		path: ROUTES.ORDER_LIST,
		Component: OrdersListPage,
	},
	{
		path: ROUTES.EMPLOYEES_LIST,
		Component: EmployeesListPage,
	},
	{
		path: ROUTES.EXPLOSIVE_OBJECT_LIST,
		Component: ExplosiveObjectListPage,
	},
	{
		path: ROUTES.TRANSPORT_LIST,
		Component: TransportListPage,
	},
	{
		path: ROUTES.EQUIPMENT_LIST,
		Component: EquipmentListPage,
	},
];

const organizationsRoutes = [
	{
		path: ROUTES.ORGANIZATIONS_LIST,
		Component: OrganizationsListPage,
	},
];

const restRoutes = [{
	path: ROUTES.SETTINGS,
	Component: SettingsPage,
}];

const notFoundRoutes = [{
	path: "*",
	Component: ErrorNotFoundPage,
}];

const devRoutes = [{
	path: "/dev",
	Component: DevPage,
}]

const authRoutes = [
	{
		id: "root",
		path: ROUTES.AUTH,
		Component: LoginPage,
	},
	{
		path: ROUTES.SIGNUP,
		Component: SignupPage,
	},
];

const waitingApproveRoutes = [
	{
		id: "root",
		path: ROUTES.WAITING_APPROVE,
		Component: WaitingApprovePage,
	},
];

const routerMain = createBrowserRouter([
	{
		id: "routerMain",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			...mainRoutes,
			...organizationsRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerOrganizations = createBrowserRouter([
	{
		id: "routerOrganizations",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			...organizationsRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerOrganization = createBrowserRouter([
	{
		id: "routerOrganization",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			...mainRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerAuth = createBrowserRouter([
	...authRoutes,
	{ path: '*', element: <Navigate to={ROUTES.AUTH} replace />},
]);

const routerWaiting = createBrowserRouter([
	...waitingApproveRoutes,
	{ path: '*', element: <Navigate to={ROUTES.WAITING_APPROVE} replace />},
]);

export const RootRouter = observer(() => {
	const store = useStore();

	const { isUser } = store.viewer ?? {};
	const { isVisibleOrganizationRoutes, isVisibleOrganizationsListRoute, isAuthorized } = store.viewer.user ?? {};

	const router = useMemo(() => {
		if(isVisibleOrganizationRoutes && isVisibleOrganizationsListRoute){
			return routerMain;
		} if(isVisibleOrganizationsListRoute){
			return routerOrganizations;
		} if(isVisibleOrganizationRoutes){
			return routerOrganization;
		} if(!isAuthorized && isUser){
			return routerWaiting
		} 

		return routerAuth
		
	}, [isVisibleOrganizationRoutes, isVisibleOrganizationsListRoute, isUser, isAuthorized])

	const renderLoader = () => (
		<div style={{ flex: 1, background: "#4070f4"}}>
			<Spin fullscreen size="large" />
		</div>
	);

	return store.isInitialized
		? (
			<RouterProvider
				router={router}
				fallbackElement={renderLoader()}
			/>
		)
		: renderLoader();
})