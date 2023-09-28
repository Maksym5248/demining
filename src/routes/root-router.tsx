import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { ReportsListPage, ReportCreatePage , TemplatePage, ErrorNotFoundPage, EmployeesListPage } from "~/pages"

import { Layout } from "./layout"

const router = createMemoryRouter([
  {
    id: "root",
    Component: Layout,
    // errorElement: ErrorNotFoundPage,
    initialIndex: 1,
    children: [
      {
        path: "/reports-list",
        Component: ReportsListPage,
        children: [{
          path: "/reports-list/create",
          Component: ReportCreatePage,
        }]
      },
      {
        path: "/",
        // path: "/employees-list",
        Component: EmployeesListPage,
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