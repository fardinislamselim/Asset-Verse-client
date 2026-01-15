import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import About from "./components/About";
import Brands from "./components/Brands";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Integrations from "./components/Integrations";
import Newsletter from "./components/Newsletter";
import Packages from "./components/Packages";
import RecentAssets from "./components/RecentAssets";
import SecuritySection from "./components/SecuritySection";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";

const Home = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser = {} } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const role = dbUser?.role;

  return (
    <div className="bg-base-100 text-base-content font-sans">
      <Hero />
      <Brands />
      <About />
      <Stats />
      <Features />
      <RecentAssets />
      <Testimonials />
      {role !== "employee" && <Packages />}
      <HowItWorks />
      <Integrations />
      <SecuritySection />
      <FAQ />
      <Newsletter />
    </div>
  );
};

export default Home;
