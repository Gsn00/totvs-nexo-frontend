import { createBrowserRouter, Navigate } from "react-router";
import Login from "../pages/Login";
import Dashboard from "../layouts/Dashboard";
import MeetingsPage from "../pages/dashboard/MeetingsPage";
import HomePage from "../pages/dashboard/HomePage";
import MeetingDetailsPage from "../pages/dashboard/MeetingPage";
import NewAnalysis from "../pages/dashboard/NewAnalysis";
import ProtectedRoute from "../components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/dashboard",
        element: <HomePage />,
      },
      {
        path: "/meetings",
        element: <MeetingsPage />,
      },
      {
        path: "/meetings/:id",
        element: <MeetingDetailsPage />,
      },
      {
        path: "/new-analysis",
        element: <NewAnalysis />,
      },
    ],
  },
]);
