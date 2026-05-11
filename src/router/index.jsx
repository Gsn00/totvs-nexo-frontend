import { createBrowserRouter } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../layouts/Dashboard";
import Home from "../pages/dashboard/Home";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard",
        element: <Home />,
      },
    ],
  },
]);
