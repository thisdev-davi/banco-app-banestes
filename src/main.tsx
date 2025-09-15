import React from "react"
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClientDetailPage } from "./pages/ClientDetailPage/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },

  {
    path: "/cliente/:id",
    element: <ClientDetailPage/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)