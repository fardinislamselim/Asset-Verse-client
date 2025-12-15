import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import HrDashboard from "../layout/HrDashboard";
import AddAsset from "../pages/HR/AddAsset/AddAsset";
import MyAsset from "../pages/HR/MyAsset/MyAsset";
import EditAsset from "../pages/HR/EditAsset/EditAsset";
import EmployeeDashboard from "../layout/EmployeeDashboard";
import AllRequests from "../pages/HR/AllRequests/AllRequests";
import RequestAsset from "../pages/employee/RequestAsset/RequestAsset";
import MyAssets from "../pages/employee/MyAssets/MyAssets";
import UpgradePackage from "../pages/HR/UpgradePackage/UpgradePackage";
import MyEmployeeList from "../pages/HR/MyEmployeeList/MyEmployeeList";
import HRProfile from "../pages/HR/Profile/Profile";
import EmployeeProfile from "../pages/employee/Profile/Profile";
import PaymentHistory from "../pages/HR/PaymentHistory/PaymentHistory";
import MyTeam from "../pages/employee/MyTeam/MyTeam";
import RequestHistory from "../pages/employee/RequestHistory/RequestHistory";

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
        path: "my-asset",
        element: <MyAsset />,
      },
      {
        path: "add-asset",
        element: <AddAsset />,
      },
      {
        path: "edit-asset/:id",
        element: <EditAsset />,
      },
      {
        path: "requests",
        element: <AllRequests />,
      },
      {
        path: "upgrade-package",
        element: <UpgradePackage />,
      },
      {
        path: "employees",
        element: <MyEmployeeList />,
      },
      {
        path: "profile",
        element: <HRProfile />,
      },
      {
        path: "payment-history",
        element: <PaymentHistory />,
      },
    ],
  },
  {
    path: "employee",
    element: (
      <PrivateRoute>
        <EmployeeDashboard></EmployeeDashboard>
      </PrivateRoute>
    ),
    children: [
      { path: "request-asset", element: <RequestAsset /> },
      { path: "my-asset", element: <MyAssets /> },
      { path: "profile", element: <EmployeeProfile /> },
      { path: "my-team", element: <MyTeam /> },
      { path: "requests-history", element: <RequestHistory /> },
    ],
  },
]);
