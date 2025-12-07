import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <div className="text-2xl font-bold text-primary">Asset Vers</div>,
      },
    ],
  },
]);
