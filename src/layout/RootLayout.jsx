import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/Navbar/NavBar";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
