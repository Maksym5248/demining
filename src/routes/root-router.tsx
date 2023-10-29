import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { MissionReportsListPage, MissionReportCreatePage, ErrorNotFoundPage, EmployeesListPage, EmployeesCreatePage, DevPage } from "~/pages"
import { CONFIG } from "~/config";
import { ROUTES } from "~/constants";

import { Layout } from "./layout"

const routes = [
  {
    path: ROUTES.MISSION_REPORT_LIST,
    Component: MissionReportsListPage,
  },
  {
    path: ROUTES.MISSION_REPORT_CREATE,
    Component: MissionReportCreatePage,
  },
  {
    path: ROUTES.EMPLOYEES_LIST,
    Component: EmployeesListPage,
  },
  {
    path: ROUTES.EMPLOYEES_CREATE,
    Component: EmployeesCreatePage,
  },
  {
    path: ROUTES.EMPLOYEES_EDIT,
    Component: EmployeesCreatePage,
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
  initialEntries: ["/", "/mission-reports-list"],
});

export function RootRouter() {
  return (
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}