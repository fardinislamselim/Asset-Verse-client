import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import HrDashboard from "../layout/HrDashboard";
import AddAsset from "../pages/HR/AddAsset/AddAsset";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "hr",
    element: (
      <PrivateRoute>
        <HrDashboard></HrDashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <h2 className="text-2xl">Hr Dashboard</h2>,
      },
      {
        path: "asset-list",
        element: <h2 className="text-2xl">Hr Dashboard</h2>,
      },
      {
        path: "add-asset",
        element: <AddAsset />,
      },
    ],
  },
]);
