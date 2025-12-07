import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/register/Register";

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
    ],
  },
]);
