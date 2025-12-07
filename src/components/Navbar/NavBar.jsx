import React from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Container from "../Container/Container";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/join-employee">Join as Employee</NavLink>
      </li>
      <li>
        <NavLink to="/join-hr">Join as HR Manager</NavLink>
      </li>
    </>
  );

  return (
    <div className=" bg-base-100 shadow-lg">
      <Container className="navbar">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navLinks}
            </ul>
          </div>
          <Link to={"/"} className="flex items-center gap-2">
            <img src={logo} alt="Asset Verse" className="w-14 h-14" />
            <h3 className="hidden sm:block text-base-content text-2xl font-bold">
              Assets Verse
            </h3>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>
        <div className="navbar-end">
          <ThemeToggle />
          <Link to={"/login"} className="btn">
            Login
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
