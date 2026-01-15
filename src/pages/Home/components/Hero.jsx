import { motion } from "framer-motion";
import { FaArrowDown, FaCheckCircle, FaRocket, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router";

const Hero = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-[65vh] lg:h-[80vh] flex items-center pt-20 lg:pt-32 bg-gradient-to-br from-base-100 via-base-100 to-base-200 overflow-hidden border-b border-base-200">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="space-y-6 text-center md:text-left"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2"
          >
            <FaRocket /> New: Enterprise Analytics v2.0
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-neutral"
          >
            Manage Assets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
              Beyond Limits
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-base-content/60 max-w-lg mx-auto md:mx-0"
          >
            Empower your organization with the next generation of asset tracking. 
            Accountability, security, and efficiency—all in one place.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="btn btn-primary btn-lg rounded-field px-8 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
            >
              Get Started Free 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/assets"
              className="btn btn-outline btn-lg rounded-field px-8 hover:bg-base-200 transition-all"
            >
              View Assets
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content - Interactive Image/Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative hidden md:flex justify-center perspective-1000"
        >
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1280"
              alt="Asset Management Dashboard"
              className="rounded-box shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-base-200 w-full max-w-lg transition-transform duration-500 group-hover:rotate-1 group-hover:scale-[1.02]"
            />
            
            {/* Floating Stats Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-10 bg-base-100 p-4 rounded-box shadow-2xl border border-base-200 flex items-center gap-4"
            >
              <div className="bg-success/10 p-3 rounded-xl text-success">
                <FaCheckCircle className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Security</p>
                <p className="font-bold text-lg">Fully Encrypted</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 -right-8 bg-base-100 p-4 rounded-box shadow-2xl border border-base-200 flex items-center gap-4 hidden lg:flex"
            >
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <FaShieldAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Uptime</p>
                <p className="font-bold text-lg">99.9% Reliable</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Visual Flow Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase font-black tracking-widest text-base-content/30">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-primary text-xl"
        >
          <FaArrowDown />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-base-100 to-transparent"></div>
    </section>
  );
};

export default Hero;

