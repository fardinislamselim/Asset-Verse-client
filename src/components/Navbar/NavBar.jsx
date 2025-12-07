import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import Container from "../Container/Container";
import logo from "../../assets/logo.png";
import useAuth from "../../hook/useAuth";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-primary font-bold border-b-2 border-primary pb-1 rounded-[0px]"
              : "text-base-content hover:text-primary transition-colors duration-200"
          }
        >
          Home
        </NavLink>
      </li>
      {/* Add more links here */}
    </>
  );

  const handleSignOut = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully!");
        setDropdownOpen(false);
      })
      .catch((err) => toast.error("Failed to log out!", err.message));
  };

  return (
    <div className="bg-base-100 shadow-xl sticky top-0 z-50">
      <Container className="navbar">
        {/* Navbar Start: Logo + Mobile Menu */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <div tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[999] mt-3 w-52 p-2 shadow-xl"
            >
              {navLinks}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Asset Verse"
              className="w-10 h-10 md:w-14 md:h-14"
            />
            <h3 className="hidden sm:block text-base-content text-xl md:text-2xl font-extrabold tracking-tight">
              Assets Verse
            </h3>
          </Link>
        </div>

        {/* Navbar Center: Desktop Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-3 text-base font-medium">
            {navLinks}
          </ul>
        </div>

        {/* Navbar End: Theme + Auth */}
        <div className="navbar-end flex items-center gap-3">
          <ThemeToggle />

          {loading ? (
            <span className="loading loading-ring loading-xl"></span>
          ) : !user ? (
            // Login Button
            <Link to="/login" className="btn btn-primary btn-sm md:btn-md">
              Login
            </Link>
          ) : (
            // User Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost btn-circle p-0 w-12 h-12 md:w-14 md:h-14 overflow-hidden transition-transform duration-200 hover:scale-105"
              >
                <div className="avatar w-full h-full p-3">
                  <div className="w-full h-full rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "Profile"}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-base-content/80 p-1" />
                    )}
                  </div>
                </div>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-3 w-48 bg-base-100 border border-base-300 rounded-lg shadow-2xl py-2 z-50 transition-opacity duration-300">
                  {/* User Info */}
                  <li className="px-4 py-2 text-sm font-semibold text-base-content truncate border-b border-base-200 mb-1">
                    {user.displayName || "User"}
                    <p className="text-xs text-base-content/60 font-normal mt-1 truncate">
                      {user.email}
                    </p>
                  </li>

                  {/* Dashboard Link */}
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-base-200 w-full transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>

                  {/* Sign Out */}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full cursor-pointer text-left px-4 py-2 hover:bg-error/10 text-error transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
