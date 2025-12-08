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

  const handleSignOut = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully!");
        setDropdownOpen(false);
      })
      .catch((err) => toast.error("Failed to log out!", err.message));
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-1 rounded-md text-[16px] transition-all duration-200 ${
              isActive
                ? "text-primary font-semibold bg-primary/10"
                : "text-base-content hover:text-primary"
            }`
          }
        >
          Home
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="backdrop-blur-xl bg-base-100/80 shadow-md sticky top-0 z-50 border-b border-base-300/40">
      <Container className="navbar py-3">
        
        {/* Left Section */}
        <div className="navbar-start gap-2">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-[999] mt-3 w-56 p-3 shadow-xl border border-base-300/40"
            >
              {navLinks}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Asset Verse"
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <h3 className="hidden sm:block text-2xl font-extrabold tracking-tight text-base-content">
              Assets Verse
            </h3>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4 text-base font-medium">
            {navLinks}
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-end flex items-center gap-4">
          <ThemeToggle />

          {loading ? (
            <span className="loading loading-ring loading-lg"></span>
          ) : !user ? (
            <Link to="/login" className="btn btn-primary btn-sm md:btn-md px-5">
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost btn-circle w-12 h-12 overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="avatar w-full h-full">
                  <div className="w-full h-full rounded-full ring-2 ring-primary/60">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "Profile"}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-base-content/70" />
                    )}
                  </div>
                </div>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-3 w-56 bg-base-100 border border-base-300/40 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  {/* User Info */}
                  <li className="px-4 py-2 border-b border-base-300/40">
                    <p className="font-semibold">{user.displayName || "User"}</p>
                    <p className="text-xs text-base-content/50 truncate">
                      {user.email}
                    </p>
                  </li>

                  {/* Dashboard Link */}
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-base-200 rounded-lg transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>

                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-error/10 text-error rounded-lg transition-colors"
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
