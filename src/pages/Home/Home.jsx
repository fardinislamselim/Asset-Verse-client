import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";
import About from "./components/About";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Newsletter from "./components/Newsletter";
import Packages from "./components/Packages";
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
      <About />
      <Stats />
      
      {role !== "employee" && <Packages />}
      <ListingSection />
      <Features />
      <Testimonials />
      <HowItWorks />
      <SecuritySection />
      <FAQ />
      <Newsletter />
      <Contact />
    </div>
  );
};

export default Home;
