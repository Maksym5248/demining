import React from "react";

import {
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";

import { FormReportPage , TemplatePage, ErrorNotFoundPage} from "~/pages"

import { Layout } from "./layout"

const router = createMemoryRouter([
  {
    id: "root",
    Component: Layout,
    // errorElement: ErrorNotFoundPage,
    initialIndex: 0,
    children: [
      {
        path: "/",
        Component: FormReportPage,
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