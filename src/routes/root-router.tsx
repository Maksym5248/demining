import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { ReportsListPage, ReportCreatePage, ErrorNotFoundPage, EmployeesListPage, EmployeesCreatePage, DevPage } from "~/pages"
import { CONFIG } from "~/config";

import { Layout } from "./layout"

const routes = [
  {
    index: true,
    Component: ReportsListPage,
  },
  {
    path: "reports-list/create",
    Component: ReportCreatePage,
  },
  {
    path: "employees-list",
    Component: EmployeesListPage,
  },
  {
    path: "employees-list/create",
    Component: EmployeesCreatePage,
  },
  {
    path: "employees-list/edit/:id",
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
]);

export function RootRouter() {
  return (
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}