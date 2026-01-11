import { motion } from "framer-motion";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          
          <div className="relative inline-block">
            <motion.div
              className="text-9xl text-error opacity-20 absolute top-0 left-0 right-0 bottom-0 blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            ></motion.div>
            <span className="text-9xl relative z-10">🚫</span>
          </div>
          
          <motion.div
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="absolute -top-4 -right-4 badge badge-error badge-lg rotate-12"
          >
            403 Error
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-base-content mb-4"
        >
          Access Denied
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-base-content/60 mb-8 max-w-md mx-auto"
        >
          Oops! You don't have permission to access this area. 
          It looks like you've ventured into restricted territory.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/" className="btn btn-primary btn-lg rounded-field px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline btn-lg rounded-field px-8 hover:bg-base-300">
            Go Back
          </button>
        </motion.div>
        
        <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 2 }}
             className="mt-12 text-sm text-base-content/40"
        >
            Error Code: 403 Forbidden
        </motion.div>
      </div>
    </div>
  );
};

export default Forbidden;
