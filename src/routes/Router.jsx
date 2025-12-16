import { createBrowserRouter } from "react-router";
import EmployeeDashboard from "../layout/EmployeeDashboard";
import HrDashboard from "../layout/HrDashboard";
import RootLayout from "../layout/RootLayout";
import AssetDetails from "../pages/employee/AssetDetails/AssetDetails";
import EmployeeHome from "../pages/employee/EmployeeHome/EmployeeHome";
import MyAssets from "../pages/employee/MyAssets/MyAssets";
import MyTeam from "../pages/employee/MyTeam/MyTeam";
import EmployeeProfile from "../pages/employee/Profile/Profile";
import RequestAsset from "../pages/employee/RequestAsset/RequestAsset";
import RequestHistory from "../pages/employee/RequestHistory/RequestHistory";
import Home from "../pages/Home/Home";
import AddAsset from "../pages/HR/AddAsset/AddAsset";
import AllRequests from "../pages/HR/AllRequests/AllRequests";
import EditAsset from "../pages/HR/EditAsset/EditAsset";
import HrHome from "../pages/HR/HrHome/HrHome";
import MyAsset from "../pages/HR/MyAsset/MyAsset";
import MyEmployeeList from "../pages/HR/MyEmployeeList/MyEmployeeList";
import PaymentHistory from "../pages/HR/PaymentHistory/PaymentHistory";
import HRProfile from "../pages/HR/Profile/Profile";
import UpgradePackage from "../pages/HR/UpgradePackage/UpgradePackage";
import Login from "../pages/Login/Login";
import Register from "../pages/register/Register";
import PrivateRoute from "./PrivateRoute";

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
        element: <HrHome />,
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
      { path: "dashboard", element: <EmployeeHome /> },
      { path: "request-asset", element: <RequestAsset /> },
      { path: "asset-details/:id", element: <AssetDetails /> },
      { path: "my-asset", element: <MyAssets /> },
      { path: "profile", element: <EmployeeProfile /> },
      { path: "my-team", element: <MyTeam /> },
      { path: "requests-history", element: <RequestHistory /> },
    ],
  },
]);
