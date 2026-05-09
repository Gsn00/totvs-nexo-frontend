import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../layouts/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
