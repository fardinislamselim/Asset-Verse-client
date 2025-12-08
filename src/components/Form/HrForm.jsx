import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router";
import {
  FaUser,
  FaBuilding,
  FaImage,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const HrForm = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // ✅ Proper Firebase Error Handler
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

  // FINAL SUBMIT FUNCTION
  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const logoImg = data.companyLogo[0];

      // 1. Register User in Firebase
      await registerUser(data.email, data.password);

      // 2. Upload Image to IMGBB
      const formData = new FormData();
      formData.append("image", logoImg);

      const imgRes = await axios.post(uploadURL, formData);
      const logoURL = imgRes.data.data.url;

      // 3. Update Firebase Profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: logoURL,
      });

      // 4. Prepare HR Data for Backend
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

      // 5. Save to Backend
      const res = await axiosSecure.post("/users", userInfo);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("HR Registered Successfully ✅");
        reset();
      } else {
        toast.error("HR saved but unexpected response ⚠️");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);

      // Firebase Error
      if (error?.code) {
        showFirebaseError(error);
      }
      // Backend Axios Error
      else if (error?.response) {
        toast.error(
          error.response?.data?.message || "Backend server error ❌"
        );
      }
      // Network / CORS Error
      else {
        toast.error("Network error or server not responding ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-2xl shadow-xl border border-base-300">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FaBuilding className="text-primary" /> HR Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="form-control">
          <label className="label font-medium">Full Name *</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Full Name"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && (
            <p className="text-error text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="form-control">
          <label className="label font-medium">Company Name *</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Company Name"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("companyName", {
                required: "Company name is required",
              })}
            />
          </div>
          {errors.companyName && (
            <p className="text-error text-sm">
              {errors.companyName.message}
            </p>
          )}
        </div>

        {/* Company Logo */}
        <div className="form-control">
          <label className="label font-medium">Company Logo *</label>
          <div className="relative">
            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full pl-10 ${focusStyle}`}
              {...register("companyLogo", {
                required: "Company Logo is required",
              })}
            />
          </div>
          {errors.companyLogo && (
            <p className="text-error text-sm">
              {errors.companyLogo.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label font-medium">Official Email *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="email"
              placeholder="Official Email"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label font-medium">Password *</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="form-control">
          <label className="label font-medium">Date of Birth *</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="date"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("dateOfBirth", {
                required: "Date of Birth is required",
              })}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-error text-sm">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn btn-primary w-full mt-4"
        >
          {uploading ? "Registering..." : "Register as HR"}
        </button>
      </form>

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
