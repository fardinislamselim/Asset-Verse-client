import About from "./components/About";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Features from "./components/Features";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Packages from "./components/Packages";
import Testimonials from "./components/Testimonials";

const Home = () => {
  return (
    <div className="bg-base-100 text-base-content font-sans overflow-x-hidden">
      <Hero />
      <About />
      <Packages />
      <Features />
      <Testimonials />
      <HowItWorks />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Home;