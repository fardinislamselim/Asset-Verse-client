import { Link, NavLink, Outlet } from "react-router"; // Use react-router-dom for proper navigation
import { FaUserCircle } from "react-icons/fa";
import {
  RiDashboardLine,
  RiAddBoxLine,
  RiFileList3Line,
  RiGroupLine,
  RiWallet3Line,
  RiUser3Line,
  RiLogoutBoxLine,
  RiSecurePaymentLine,
} from "react-icons/ri";

import logo from "../assets/logo.png";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import useAuth from "../hook/useAuth";

const HrDashboard = () => {
  const { user, logOut } = useAuth();

  const hrLinks = [
    { to: "/hr/dashboard", icon: RiDashboardLine, text: "Dashboard" },
    { to: "/hr/my-asset", icon: RiFileList3Line, text: "My Asset List" },
    { to: "/hr/add-asset", icon: RiAddBoxLine, text: "Add Asset" },
    { to: "/hr/requests", icon: RiFileList3Line, text: "All Requests" },
    { to: "/hr/employees", icon: RiGroupLine, text: "Employee List" },
    { to: "/hr/upgrade-package", icon: RiWallet3Line, text: "Upgrade Package" },
    {
      to: "/hr/payment-history",
      icon: RiSecurePaymentLine,
      text: "Payment History",
    },
  ];

  return (
    <div className="drawer lg:drawer-open bg-base-100">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* ======================================= */}
      {/* 1. Main Content & Navbar (Drawer Content) */}
      {/* ======================================= */}
      <div className="drawer-content min-h-screen flex flex-col">
        <nav className="navbar w-full bg-base-100 shadow-lg sticky top-0 z-20">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              </svg>
            </label>
          </div>

          <div className="flex justify-between items-center w-full px-4 lg:px-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-neutral lg:hidden"
            >
              <img
                src={logo}
                alt="AssetVerse Logo"
                className="w-8 h-8 object-contain"
              />
              Asset<span className="text-primary">Verse</span>
            </Link>

            <h2 className="text-xl font-semibold hidden sm:block">
              HR Manager Dashboard
            </h2>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border-2 border-primary hover:border-accent p-0"
                >
                  <div className="w-10 rounded-full">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user?.displayName || "Profile"}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-4xl text-neutral-content" />
                    )}
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-[10] p-2 shadow-xl bg-base-200 rounded-box w-52 mt-4 text-base"
                >
                  <li className="menu-title">
                    <span>{user?.displayName || "HR Manager"}</span>
                  </li>
                  <li>
                    <Link to="/hr/profile">
                      <RiUser3Line /> Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={logOut} className="text-error">
                      <RiLogoutBoxLine /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page content here */}
        <main className="p-4 lg:p-8 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* ======================================= */}
      {/* 2. Sidebar (Drawer Side) */}
      {/* ======================================= */}
      <div className="drawer-side z-30 shadow-2xl">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="w-64 bg-base-200 min-h-full p-4 flex flex-col">
          {/* Sidebar Branding */}
          <Link
            to="/"
            className="flex items-center gap-3 mb-8 px-4 py-3 border-b border-base-300"
          >
            <img
              src={logo}
              alt="AssetVerse Logo"
              className="w-9 h-9 object-contain"
            />
            <h3 className="font-extrabold text-2xl text-neutral">
              Asset<span className="text-primary">Verse</span>
            </h3>
          </Link>

          {/* Sidebar Menu */}
          <ul className="menu text-base font-semibold space-y-2 flex-grow">
            <li className="menu-title">HR Management</li>
            {hrLinks.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary text-primary-content hover:bg-primary/90 rounded-xl"
                      : "hover:bg-base-300 text-base-content rounded-xl"
                  }
                >
                  <item.icon className="text-xl" />
                  {item.text}
                </NavLink>
              </li>
            ))}

            <li className="menu-title pt-4">Account</li>
            <li>
              <NavLink
                to={"/hr/profile"}
                className={({ isActive }) =>
                  isActive
                    ? "bg-primary text-primary-content hover:bg-primary/90 rounded-xl"
                    : "hover:bg-base-300 text-base-content rounded-xl"
                }
              >
                <RiUser3Line className="text-xl" />
                Profile
              </NavLink>
            </li>
            <li>
              <button
                onClick={logOut}
                className="text-error hover:bg-error/10 rounded-xl"
              >
                <RiLogoutBoxLine className="text-xl" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
