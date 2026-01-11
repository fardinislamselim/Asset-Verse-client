import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import {
  RiAddCircleLine,
  RiDashboardLine,
  RiLogoutBoxLine,
  RiUser3Line,
  RiVipCrownLine
} from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import Container from "../Container/Container";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: dbUser = {}, isLoading: isRoleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const role = dbUser?.role;

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
        setMobileMenuOpen(false);
        navigate("/");
      })
      .catch((err) => toast.error("Failed to log out!", err.message));
  };

  const navLinkStyle = ({ isActive }) =>
    `px-3 py-2 rounded-field font-semibold transition-all duration-300 ${
      isActive
        ? "text-primary bg-primary/10 shadow-sm"
        : "text-base-content/70 hover:text-primary hover:bg-base-200"
    }`;

  const navItem = (to, text) => (
    <li>
      <NavLink to={to} className={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>
        {text}
      </NavLink>
    </li>
  );

  const hashNavItem = (to, text) => (
    <li>
      <Link
        to={to}
        className="px-3 py-2 rounded-field font-semibold text-base-content/70 hover:text-primary hover:bg-base-200 transition-all duration-300"
        onClick={() => setMobileMenuOpen(false)}
      >
        {text}
      </Link>
    </li>
  );

  const publicLinks = (
    <>
      {navItem("/", "Home")}
      {navItem("/assets", "Available Assets")}
      {hashNavItem("/#about", "About")}
      {hashNavItem("/#contact", "Contact")}
      {navItem("/register", "Join Free")}
    </>
  );

  const employeeLinks = (
    <>
      {navItem("/", "Home")}
      {navItem("/assets", "Available Assets")}
      {navItem("/employee/my-asset", "My Assets")}
      {navItem("/employee/my-team", "My Team")}
      {navItem("/employee/request-asset", "Request Asset")}
    </>
  );

  const hrLinks = (
    <>
      {navItem("/", "Home")}
      {navItem("/assets", "Available Assets")}
      {navItem("/hr/my-asset", "Asset List")}
      {navItem("/hr/requests", "All Requests")}
      {navItem("/hr/employees", "Employee List")}
    </>
  );

  const employeeMenu = [
    { to: "/employee/dashboard", text: "Dashboard", icon: RiDashboardLine },
    { to: "/employee/profile", text: "Profile", icon: RiUser3Line },
    { to: "/employee/request-asset", text: "New Request", icon: RiAddCircleLine },
  ];

  const hrMenu = [
    { to: "/hr/dashboard", text: "Dashboard", icon: RiDashboardLine },
    { to: "/hr/profile", text: "Profile", icon: RiUser3Line },
    { to: "/hr/add-asset", text: "Add Asset", icon: RiAddCircleLine },
    { to: "/hr/add-employee", text: "Add Employee", icon: RiAddCircleLine },
    { to: "/hr/upgrade-package", text: "Upgrade", icon: RiVipCrownLine },
  ];

  const profileDropdownItems = role === "hr" ? hrMenu : employeeMenu;

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-base-100/80 border-b border-base-200 transition-all duration-300">
      <Container className="navbar py-2 lg:py-4">
        {/* Navbar Start: Logo */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-neutral hidden sm:block">
              Asset<span className="text-primary">Verse</span>
            </span>
          </Link>
        </div>

        {/* Navbar Center: Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {!user && publicLinks}
            {user && role === "employee" && employeeLinks}
            {user && role === "hr" && hrLinks}
          </ul>
        </div>

        {/* Navbar End: Actions & Profile */}
        <div className="navbar-end gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {loading || (user && isRoleLoading) ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm sm:btn-md font-bold rounded-field"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm sm:btn-md rounded-field shadow-lg shadow-primary/20"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-base-200 transition-all border border-base-300"
              >
                <div className="avatar">
                  <div className="w-8 sm:w-10 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" />
                    ) : (
                      <FaUserCircle className="w-full h-full text-base-300" />
                    )}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[100px]">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize">{role}</p>
                </div>
              </button>

              {/* Advanced Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-base-100 rounded-box shadow-2xl border border-base-200 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                  <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-b border-base-200">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring-1 ring-primary/20">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" />
                          ) : (
                            <FaUserCircle className="w-full h-full text-base-300" />
                          )}
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold truncate text-base-content">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-base-content/60 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="p-2 py-3">
                    {profileDropdownItems.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.to}
                          className="flex items-center gap-3 px-4 py-2 rounded-field text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="p-2 bg-base-200 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <item.icon className="text-lg" />
                          </span>
                          {item.text}
                        </Link>
                      </li>
                    ))}
                    <div className="divider my-1 px-4 opacity-50"></div>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-field text-sm font-bold text-error hover:bg-error/10 transition-all"
                      >
                        <span className="p-2 bg-error/10 rounded-lg">
                          <RiLogoutBoxLine className="text-lg" />
                        </span>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base-100/95 backdrop-blur-lg shadow-2xl border-t border-base-200 p-6 animate-in slide-in-from-top duration-300">
          <ul className="menu menu-vertical gap-2 p-0 w-full">
            {!user && publicLinks}
            {user && role === "employee" && employeeLinks}
            {user && role === "hr" && hrLinks}
            <div className="divider opacity-50"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Theme</span>
              <ThemeToggle />
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;

