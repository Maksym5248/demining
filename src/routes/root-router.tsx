import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import {
  MissionReportsListPage,
  OrdersListPage,
  MissionRequestListPage, 
  ErrorNotFoundPage,
  EmployeesListPage,
  ExplosiveObjectListPage,
  TransportListPage,
  EquipmentListPage,
  DevPage 
} from "~/pages"
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";

import { Layout } from "./layout"

const routes = [
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
    path: "*",
    Component: ErrorNotFoundPage,
  },
];

if(CONFIG.IS_DEV){
  routes.push(  {
    path: "/dev",
    Component: DevPage,
  })
}

const router = createMemoryRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    children: routes,
  },
], {
  initialEntries: ["/", ROUTES.MISSION_REPORT_LIST],
});

export function RootRouter() {
  return (
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}