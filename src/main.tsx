import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Layout } from "./components/Layout";
import { ClientListPage } from "./pages/ClientListPage";
import { ClientDetailPage } from "./pages/ClientDetailPage";

const roteador = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children:
      [
        { 
          path: "/",
          element: <ClientListPage />
        },
        { path: "/cliente/:id",
          element: <ClientDetailPage />
        },
      ],
    },
  ],
  {
    basename: "/banco-app-banestes/",
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={roteador} />
  </React.StrictMode>
);