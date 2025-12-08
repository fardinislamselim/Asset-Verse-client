import React from "react";
import Lottie from "lottie-react";
import Container from "../../components/Container/Container";
import LoginForm from "../../components/Form/LoginForm";
import loginAnimation from "../../assets/Lottie/register.json";

const Login = () => {
  return (
    <div className="bg-base-100 min-h-screen">
      <Container className="flex flex-col lg:flex-row justify-between h-full py-12">
        {/* Left Side: Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-base-content mb-6">
            Login to Your Account
          </h2>

          <div className="overflow-hidden">
            <LoginForm />
          </div>

        </div>

        {/* Right Side: Lottie Animation */}
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
