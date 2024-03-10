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
	OrganizationsListPage,
	MembersListPage,
	TemplatesListPage
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
	{
		path: ROUTES.TEMPLATES,
		Component: TemplatesListPage,
	},
];

const rootAdminRoutes = [
	{
		path: ROUTES.ORGANIZATIONS_LIST,
		Component: OrganizationsListPage,
	},
	{
		path: ROUTES.MEMBERS_LIST,
		Component: MembersListPage,
	},
];

const organizationAdminRoutes = [
	{
		path: ROUTES.MY_ORGANIZATION,
		Component: MembersListPage,
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

const routerAll = createBrowserRouter([
	{
		id: "routerAll",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			...mainRoutes,
			...rootAdminRoutes,
			...organizationAdminRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerRootAdmin = createBrowserRouter([
	{
		id: "routerRootAdmin",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.ORGANIZATIONS_LIST} replace />},
			...rootAdminRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerOrganizationAdmin = createBrowserRouter([
	{
		id: "routerOrganizationAdmin",
		path: "/",
		Component: Layout,
		children: [
			{ index: true, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.WAITING_APPROVE, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			{ path: ROUTES.AUTH, element: <Navigate to={ROUTES.MISSION_REPORT_LIST} replace />},
			...mainRoutes,
			...organizationAdminRoutes,
			...restRoutes,
			...notFoundRoutes,
			...(CONFIG.IS_DEV ? devRoutes: [])
		],
	},
]);

const routerOrganizationViewer = createBrowserRouter([
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

	const { isNotApproved } = store.viewer ?? {};
	const { isRootAdmin,isOrganizationAdmin, isOrganizationMember } = store.viewer.user ?? {};

	const router = useMemo(() => {
		if(isRootAdmin && (isOrganizationAdmin || isOrganizationMember)){
			return routerAll;
		} if(isRootAdmin){
			return routerRootAdmin;
		} if(isOrganizationAdmin){
			return routerOrganizationAdmin;
		} if(isOrganizationMember){
			return routerOrganizationViewer;
		} if(isNotApproved){
			return routerWaiting
		} 

		return routerAuth
		
	}, [isRootAdmin, isOrganizationAdmin, isOrganizationMember, isNotApproved])

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