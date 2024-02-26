import {
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
	WaitingApprovePage
} from "~/pages"
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";
import { useStore } from "~/hooks";

import { Layout } from "./layout"

const routesMain = [
	{
		index: true,
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
		path: ROUTES.SETTINGS,
		Component: SettingsPage,
	},
	{
		path: "*",
		Component: ErrorNotFoundPage,
	},
];

if(CONFIG.IS_DEV){
	routesMain.push(  {
		path: "/dev",
		Component: DevPage,
	})
}

const routerMain = createBrowserRouter([
	{
		id: "root",
		path: ROUTES.MISSION_REPORT_LIST,
		Component: Layout,
		children: routesMain,
	},
]);

const routerAuth = createBrowserRouter([
	{
		id: "root",
		index: true,
		Component: LoginPage,
	},
	{
		path: ROUTES.SIGNUP,
		Component: SignupPage,
	},
]);

const waitingApproveAuth = createBrowserRouter([
	{
		id: "root",
		index: true,
		Component: WaitingApprovePage,
	},
]);

export const RootRouter = observer(() => {
	const store = useStore();

	const getRoute = () => {
		if(store.viewer.user?.isAuthorized){
			return routerMain;
		}
		if(!store.viewer.user?.isAuthorized && store.viewer.isUser){
			return waitingApproveAuth
		} 

		return routerAuth
	}
	
	return store.isInitialized
		? (
			<RouterProvider
				router={getRoute()}
				fallbackElement={<p>Initial Load...</p>}
			/>
		)
		: (
			<div style={{ flex: 1, background: "#4070f4"}}>
				<Spin fullscreen size="large" />
			</div>
		);
})