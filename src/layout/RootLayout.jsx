import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/Navbar/NavBar";

const RootLayout = () => {
  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
