import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import loginAnimation from "../../assets/Lottie/register.json";
import Container from "../../components/Container/Container";
import LoginForm from "../../components/Form/LoginForm";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const Login = () => {
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
    <div className="bg-base-100 min-h-screen pt-24 lg:pt-32">
      <Container className="flex flex-col lg:flex-row justify-between h-full py-12">

        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-base-content mb-6">
            Login to Your Account
          </h2>

          <div className="overflow-hidden">
            <LoginForm />
          </div>

        </div>

        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-8">
          <div className="max-w-md">
            <Lottie animationData={loginAnimation} loop={true} />
          </div>
          <h2 className="text-3xl font-bold text-center text-primary mt-4">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Login to your account and continue managing your workflow efficiently.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;
