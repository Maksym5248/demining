import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { ReportsListPage, ReportCreatePage , TemplatePage, ErrorNotFoundPage, EmployeesListPage, EmployeesCreatePage } from "~/pages"

import { Layout } from "./layout"

const router = createMemoryRouter([
  {
    id: "root",
    path: "/",
    Component: Layout,
    children: [
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
        path: "/template",
        Component: TemplatePage,
      },
      {
        path: "/template1",
        Component: TemplatePage,
      },
      {
        path: "*",
        Component: ErrorNotFoundPage,
      },
    ],
  },
]);

export function RootRouter() {
  return (
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}