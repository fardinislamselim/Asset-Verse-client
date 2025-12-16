import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import {
  RiAddCircleLine,
  RiDashboardLine,
  RiFileList3Line,
  RiHistoryLine,
  RiLogoutBoxLine,
  RiTeamLine,
  RiUser3Line,
  RiVipCrownLine,
} from "react-icons/ri"; // Import icons
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

  // Fetch user role from MongoDB
  const { data: dbUser = {}, isLoading: isRoleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const role = dbUser?.role;

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
        setMobileMenuOpen(false);
        navigate("/");
      })
      .catch((err) => toast.error("Failed to log out!", err.message));
  };

  // --- Public Links ---
  const publicLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "text-primary bg-primary/10" : "hover:text-primary"
            }`
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive ? "text-primary bg-primary/10" : "hover:text-primary"
            }`
          }
          onClick={() => setMobileMenuOpen(false)}
        >
          Join Free
        </NavLink>
      </li>
    </>
  );

  // --- Employee Menu Items ---
  const employeeMenu = [
    { to: "/employee/dashboard", text: "Dashboard", icon: RiDashboardLine },
    { to: "/employee/my-asset", text: "My Assets", icon: RiFileList3Line },
    {
      to: "/employee/request-asset",
      text: "Request Asset",
      icon: RiAddCircleLine,
    },
    { to: "/employee/my-team", text: "My Team", icon: RiTeamLine },
    { to: "/employee/profile", text: "Profile", icon: RiUser3Line },
  ];

  // --- HR Manager Menu Items ---
  const hrMenu = [
    { to: "/hr/", text: "Dashboard", icon: RiDashboardLine },
    { to: "/hr/my-asset", text: "Asset List", icon: RiFileList3Line },
    { to: "/hr/add-asset", text: "Add Asset", icon: RiAddCircleLine },
    { to: "/hr/requests", text: "All Requests", icon: RiHistoryLine },
    { to: "/hr/employees", text: "Employee List", icon: RiTeamLine },
    {
      to: "/hr/upgrade-package",
      text: "Upgrade Package",
      icon: RiVipCrownLine,
    },
    { to: "/hr/profile", text: "Profile", icon: RiUser3Line },
  ];

  const menuItems =
    role === "hr" ? hrMenu : role === "employee" ? employeeMenu : [];

  return (
    <div className="backdrop-blur-xl bg-base-100/90 shadow-sm sticky top-0 z-50 border-b border-base-200">
      <Container className="navbar py-3 px-4 lg:px-8">
        {/* ================= LEFT: LOGO ================= */}
        <div className="navbar-start w-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="AssetVerse Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <h3 className="hidden sm:block text-2xl font-bold tracking-tight text-neutral group-hover:text-primary transition-colors">
              Asset<span className="text-primary">Verse</span>
            </h3>
          </Link>
        </div>

        {/* ================= CENTER: PUBLIC LINKS (Desktop) ================= */}
        <div className="navbar-center hidden lg:flex">
          {!user && (
            <ul className="menu menu-horizontal px-1 gap-2 text-base">
              {publicLinks}
            </ul>
          )}
        </div>

        {/* ================= RIGHT: AUTH & UTILS ================= */}
        <div className="navbar-end flex items-center gap-3 ml-auto w-auto">
          <ThemeToggle />

          {/* Loading State */}
          {loading || (user && isRoleLoading) ? (
            <span className="loading loading-spinner text-primary"></span>
          ) : !user ? (
            /* Not Logged In */
            <Link
              to="/login"
              className="btn btn-primary px-6 rounded-lg font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
            >
              Login
            </Link>
          ) : (
            /* Logged In */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-ghost btn-circle avatar border-2 border-transparent hover:border-primary/20 transition-all"
              >
                <div className="w-10 rounded-full">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" />
                  ) : (
                    <FaUserCircle className="w-full h-full text-neutral/50" />
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden transform origin-top-right transition-all">
                  {/* User Header */}
                  <div className="px-6 py-4 bg-base-200/50 border-b border-base-200">
                    <p className="font-bold text-neutral truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    <span className="badge badge-xs badge-primary mt-1 uppercase font-bold text-[10px] py-1 px-2">
                      {role || "User"}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <ul className="py-2">
                    {menuItems.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.to}
                          className="flex items-center gap-3 px-6 py-3 text-sm font-medium hover:bg-base-200 text-gray-700 hover:text-primary transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <item.icon className="text-lg" />
                          {item.text}
                        </Link>
                      </li>
                    ))}

                    <div className="divider my-1 px-4"></div>

                    {/* Logout */}
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-error hover:bg-error/5 transition-colors"
                      >
                        <RiLogoutBoxLine className="text-lg" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <button
              className="btn btn-ghost lg:hidden ml-2 text-2xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
      </Container>

      {/* ================= MOBILE MENU (Public Only) ================= */}
      {/* Logged in users use the avatar dropdown for navigation mainly, but if you want specific mobile menu for them we could add it. 
          Currently, for logged in users, the top-right avatar is accessible on mobile. 
          This section is for the PUBLIC horizontal links collapsing. */}
      {mobileMenuOpen && !user && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-base-100 shadow-xl border-t border-base-200 p-4 flex flex-col gap-2">
          <ul className="menu menu-vertical w-full text-base">{publicLinks}</ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
