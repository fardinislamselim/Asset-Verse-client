import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEnvelope, FaEye, FaEyeSlash, FaFacebook, FaGoogle, FaLock, FaUserShield } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hook/useAuth";
import useAxiosPublic from "../../hook/useAxiosPublic";

const LoginForm = () => {
  const { signInUser, googleSignIn, facebookSignIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const focusStyle = "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  const handleSocialSignIn = async (method) => {
    setLoading(true);
    try {
      const result = await method();
      const user = result.user;
      
      // Check if user exists in DB, if not they might need to pick a role.
      // For this implementation, we'll try to find them. If they don't exist, we default them or redirect to role selection.
      const res = await axiosPublic.get(`/user-by-email/${user.email}`);
      
      if (!res.data) {
          // If totally new user via social on login page, we might need to handle this.
          // Usually, they should register first. But we can default to 'employee' if we want to be smooth.
          const userInfo = {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              role: 'employee', // Default role if unknown
              createdAt: new Date(),
              status: 'active'
          };
          await axiosPublic.post('/users', userInfo);
          toast.success("Welcome to AssetVerse! Registered as Employee.");
          navigate("/employee/dashboard", { replace: true });
      } else {
          const redirectPath = res.data.role === "hr" ? "/hr/dashboard" : "/employee/dashboard";
          toast.success(`Welcome back, ${user.displayName}!`);
          navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Social login failed");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === "admin") {
      setValue("email", "hr-1@assetsvers.com");
      setValue("password", "123456");
      toast.success("Admin Demo credentials filled!");
    } else {
      setValue("email", "employee@demo.com");
      setValue("password", "123456");
      toast.success("Employee Demo credentials filled!");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signInUser(data.email, data.password);
      
      // Get user role from server
      const res = await axiosPublic.get(`/user-by-email/${data.email}`);
      const userRole = res.data?.role;
      
      const redirectPath = userRole === "hr" ? "/hr/dashboard" : "/employee/dashboard";
      
      toast.success("Login successful ✅");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 p-8 rounded-3xl shadow-2xl border border-base-200 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
           <FaUserShield className="text-3xl text-primary" />
        </div>
        <h2 className="text-3xl font-black text-base-content">Welcome Back</h2>
        <p className="text-base-content/50 text-sm mt-1">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
            <input
              type="email"
              placeholder="e.g. alex@company.com"
              className={`input input-bordered w-full pl-12 h-12 rounded-xl border-base-300 ${focusStyle}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && <p className="text-error text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div className="form-control">
          <div className="flex justify-between items-center pr-1">
             <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Password</label>
             <Link to="/forgot-password" size="xs" className="text-xs text-primary font-bold hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`input input-bordered w-full pl-12 h-12 rounded-xl border-base-300 ${focusStyle}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs mt-1 font-medium">{errors.password.message}</p>}
          <div className="text-right mt-1">
            <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline font-semibold">
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 mt-2"
        >
          {loading ? <span className="loading loading-spinner"></span> : "Sign In"}
        </button>
      </form>

      <div className="divider text-xs font-bold opacity-30 my-8">OR CONTINUE WITH</div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => handleSocialSignIn(googleSignIn)}
          className="btn btn-outline border-base-300 rounded-xl gap-2 hover:bg-base-200 hover:text-base-content hover:border-base-300"
        >
          <FaGoogle className="text-error" /> Google
        </button>
        <button 
          onClick={() => handleSocialSignIn(facebookSignIn)}
          className="btn btn-outline border-base-300 rounded-xl gap-2 hover:bg-base-200 hover:text-base-content hover:border-base-300"
        >
          <FaFacebook className="text-info" /> Facebook
        </button>
      </div>

      <div className="space-y-3 bg-base-200/50 p-4 rounded-2xl border border-base-200">
        <p className="text-[10px] font-black uppercase text-base-content/40 text-center tracking-widest">Demo Accounts</p>
        <div className="flex gap-2">
            <button 
                onClick={() => setDemoCredentials("admin")}
                className="btn btn-xs btn-outline flex-1 rounded-lg font-bold"
            >
                Admin Access
            </button>
            <button 
                onClick={() => setDemoCredentials("employee")}
                className="btn btn-xs btn-outline flex-1 rounded-lg font-bold"
            >
                Staff Access
            </button>
        </div>
      </div>

      <p className="text-center mt-8 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-bold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
