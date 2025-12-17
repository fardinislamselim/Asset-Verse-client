// LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const LoginForm = () => {
  const { signInUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the path from location.state.from.pathname if user was redirected
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const focusStyle =
    "focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1. Sign in the user
      await signInUser(data.email, data.password);
      
      // 2. Fetch user role from backend
      const res = await axiosSecure.get("/user");
      const userRole = res.data?.role;

      toast.success("Login successful ✅");

      // 3. Redirect based on role or 'from' location
      let redirectPath = from;
      
      if (!redirectPath) {
        // If no 'from' location, redirect based on role
        redirectPath = userRole === "hr" ? "/hr/dashboard" : "/employee/dashboard";
      }

      navigate(redirectPath, { replace: true });
      setLoading(false);
    } catch (err) {
      toast.error(err.message || "Login failed ❌");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-2xl shadow-xl border border-base-300 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FaUser className="text-primary" /> Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="form-control">
          <label className="label font-medium">Email *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="email"
              placeholder="Enter your email"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label font-medium">Password *</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-50"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full mt-4"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-semibold underline hover:text-primary/80 transition">
          Register
        </Link>
      </p>

      <p className="text-sm text-center mt-2">
        <Link
          to="/forgot-password"
          className="text-primary font-semibold underline hover:text-primary/80 transition"
        >
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;