import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { FaUser, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router";
import registerAnimation from "../../assets/Lottie/register.json";
import Container from "../../components/Container/Container";
import EmployeeForm from "../../components/Form/EmployeeForm";
import HrForm from "../../components/Form/HrForm";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const Register = () => {
  const [role, setRole] = useState("employee");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  useEffect(() => {
    if (!loading && user && dbUser?.role) {
      const redirectPath = dbUser.role === "hr" ? "/hr/dashboard" : "/employee/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [user, loading, dbUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 pt-24 lg:pt-32 pb-20">
      {" "}
      <Container className="flex flex-col lg:flex-row justify-between h-full ">

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-base-content mb-6">
            Register as {role === "employee" ? "Employee" : "HR"}
          </h2>

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
