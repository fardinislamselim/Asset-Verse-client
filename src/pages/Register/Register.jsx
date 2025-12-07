import { useState } from "react";
import EmployeeForm from "../../components/Form/EmployeeForm";
import HrForm from "../../components/Form/HrForm";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { FaUserTie, FaUser } from "react-icons/fa";
import registerAnimation from "../../assets/Lottie/register.json";
import Container from "../../components/Container/Container";

const Register = () => {
  const [role, setRole] = useState("employee");

  return (
    <div className="bg-base-100">
      {" "}
      <Container className="flex justify-between h-full ">
        {/* Left Side: Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-base-content mb-6">
            Register as {role === "employee" ? "Employee" : "HR"}
          </h2>

          {/* Role Switch Buttons */}
          <div className="flex gap-4 space-x-4 mb-6 bg-base-200 p-4 rounded-xl shadow-inner">
            <button
              onClick={() => setRole("employee")}
              className={`btn flex-1 gap-2 transition-all duration-300 transform ${
                role === "employee"
                  ? "btn-primary shadow-lg scale-105"
                  : "btn-ghost hover:scale-105"
              }`}
            >
              <FaUser className="text-lg" />
              Employee
            </button>

            <button
              onClick={() => setRole("hr")}
              className={`btn flex-1 gap-2 transition-all duration-300 transform ${
                role === "hr"
                  ? "btn-primary shadow-lg scale-105"
                  : "btn-ghost hover:scale-105"
              }`}
            >
              <FaUserTie className="text-lg" />
              HR
            </button>
          </div>

          {/* Animated Form Switch */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {role === "employee" ? (
                <motion.div
                  key="employee"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmployeeForm />
                </motion.div>
              ) : (
                <motion.div
                  key="hr"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HrForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Right Side: Lottie Animation */}
        <div className="hidden w-1/2  lg:flex flex-col items-center justify-center p-8">
          <div className="max-w-md">
            <Lottie animationData={registerAnimation} loop={true} />
          </div>
          <h2 className="text-3xl font-bold text-center text-primary mt-4">
            Join Our Team
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Create an account to manage your workflow efficiently.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Register;
