import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    FaBuilding,
    FaCalendarAlt,
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaFacebook,
    FaGoogle,
    FaImage,
    FaLock,
    FaUser,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const HrForm = () => {
  const { registerUser, updateUserProfile, googleSignIn, facebookSignIn } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/hr/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;
  const uploadURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

  const focusStyle =
    "focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary";

  const showFirebaseError = (error) => {
    let message = "Something went wrong ❌";

    if (error?.code) {
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered 📧";
          break;
        case "auth/invalid-email":
          message = "Invalid email address ❌";
          break;
        case "auth/weak-password":
          message = "Password must be at least 6 characters 🔒";
          break;
        case "auth/operation-not-allowed":
          message = "Email/Password login is disabled ❌";
          break;
        case "auth/network-request-failed":
          message = "Network error, check your internet 🌐";
          break;
        default:
          message = error.message || message;
      }
    } else {
      message = error.message || message;
    }

    toast.error(message);
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const logoImg = data.companyLogo[0];

      await registerUser(data.email, data.password);

      const formData = new FormData();
      formData.append("image", logoImg);

      const imgRes = await axios.post(uploadURL, formData);
      const logoURL = imgRes.data.data.url;

      await updateUserProfile({
        displayName: data.name,
        photoURL: logoURL,
      });

      const userInfo = {
        name: data.name,
        companyName: data.companyName,
        companyLogo: logoURL,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        role: "hr",
        packageLimit: 5,
        currentEmployees: 0,
        subscription: "basic",
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/users", userInfo);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("HR Registered Successfully ✅");
        reset();
        navigate(from, { replace: true });
      } else {
        toast.error("HR saved but unexpected response ⚠️");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error?.code) {
        showFirebaseError(error);
      }

      else if (error?.response) {
        toast.error(
          error.response?.data?.message || "Backend server error ❌"
        );
      }

      else {
        toast.error("Network error or server not responding ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-box shadow-xl border border-base-300">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FaBuilding className="text-primary" /> HR Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Full Name *</label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="text"
              placeholder="Name"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && <p className="text-error text-[10px] mt-1 font-bold">{errors.name.message}</p>}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Company Name *</label>
          <div className="relative">
            <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="text"
              placeholder="Your Business"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("companyName", { required: "Company name is required" })}
            />
          </div>
          {errors.companyName && <p className="text-error text-[10px] mt-1 font-bold">{errors.companyName.message}</p>}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Company Logo *</label>
          <div className="relative">
            <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("companyLogo", { required: "Logo is required" })}
            />
          </div>
          {errors.companyLogo && <p className="text-error text-[10px] mt-1 font-bold">{errors.companyLogo.message}</p>}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Official Email *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="email"
              placeholder="Email"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && <p className="text-error text-[10px] mt-1 font-bold">{errors.email.message}</p>}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Password *</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 chars" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/30"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-error text-[10px] mt-1 font-bold">{errors.password.message}</p>}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Date of Birth *</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="date"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("dateOfBirth", { required: "DOB is required" })}
            />
          </div>
          {errors.dateOfBirth && <p className="text-error text-[10px] mt-1 font-bold">{errors.dateOfBirth.message}</p>}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn btn-primary w-full mt-6 rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
        >
          {uploading ? <span className="loading loading-spinner"></span> : "Create Business Account"}
        </button>
      </form>

      <div className="divider text-[10px] font-black opacity-30 my-6 tracking-widest uppercase">OR REGISTER WITH</div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={async () => {
            try {
              const result = await googleSignIn();
              const user = result.user;
              const userInfo = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: "hr",
                packageLimit: 5,
                currentEmployees: 0,
                subscription: "basic",
                createdAt: new Date(),
              };
              await axiosSecure.post("/users", userInfo);
              toast.success("HR registration via Google successful!");
              navigate("/hr/dashboard", { replace: true });
            } catch (err) {
              toast.error(err.message || "Google signup failed");
            }
          }}
          className="btn btn-outline border-base-300 rounded-xl gap-2 hover:bg-base-200 hover:text-base-content"
        >
          <FaGoogle className="text-error" /> Google
        </button>
        <button 
          onClick={async () => {
             try {
                const result = await facebookSignIn();
                const user = result.user;
                const userInfo = {
                  name: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL,
                  role: "hr",
                  packageLimit: 5,
                  currentEmployees: 0,
                  subscription: "basic",
                  createdAt: new Date(),
                };
                await axiosSecure.post("/users", userInfo);
                toast.success("HR registration via Facebook successful!");
                navigate("/hr/dashboard", { replace: true });
             } catch (err) {
                toast.error(err.message || "Facebook signup failed");
             }
          }}
          className="btn btn-outline border-base-300 rounded-xl gap-2 hover:bg-base-200 hover:text-base-content"
        >
          <FaFacebook className="text-info" /> Facebook
        </button>
      </div>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default HrForm;
