import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";

const Hero = () => {
  // Animation Variants
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
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-base-100 to-base-200 overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-extrabold leading-tight text-neutral"
          >
            Manage Assets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Like a Pro
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-500 max-w-lg">
            The ultimate B2B platform for asset tracking, employee accountability,
            and seamless HR operations. Simplify your workflow today.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 pt-4">
            <Link
              to="/register"
              className="btn btn-primary btn-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Join as HR Manager
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg border-2">
              Join as Employee
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:flex justify-center"
        >
          <img
             src="https://img.freepik.com/free-vector/gradient-ui-ux-elements-background_23-2149056159.jpg"
            alt="Asset Management Dashboard"
            className="rounded-3xl shadow-2xl border-4 border-base-100 w-full max-w-lg"
          />
          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 dark:bg-neutral"
          >
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <FaCheckCircle className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-400">System Status</p>
              <p className="font-bold text-lg">100% Secure</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
