import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    FaCalendarAlt,
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaFacebook,
    FaGoogle,
    FaImage,
    FaLock,
    FaUser
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";

import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const EmployeeForm = () => {
  const { registerUser, updateUserProfile, googleSignIn, facebookSignIn } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/employee/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const focusStyle =
    "focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary";

  const image_API_URL = `https://api.imgbb.com/1/upload?key=${
    import.meta.env.VITE_IMGBB_API_KEY
  }`;

  const showFirebaseError = (error) => {
    let message = "Something went wrong ❌";

    if (error?.code) {
      const errorMap = {
        "auth/email-already-in-use": "This email is already registered 📧",
        "auth/invalid-email": "Invalid email address ❌",
        "auth/weak-password": "Password must be at least 6 characters 🔒",
        "auth/network-request-failed":
          "Network error, check your internet 🌐",
      };

      message = errorMap[error.code] || error.message || message;
    } else {
      message = error.message || message;
    }

    toast.error(message);
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      const profileImg = data.profilePicture?.[0];
      if (!profileImg) {
        toast.error("Profile image is required");
        return;
      }

      await registerUser(data.email, data.password);

      const formData = new FormData();
      formData.append("image", profileImg);

      const imgRes = await axios.post(image_API_URL, formData);

      if (!imgRes.data?.data?.url) {
        throw new Error("Image upload failed");
      }

      const photoURL = imgRes.data.data.url;

      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      const employeeInfo = {
        name: data.name.trim(),
        email: data.email.toLowerCase(),
        photoURL,
        dateOfBirth: data.dateOfBirth,
        role: "employee",
        createdAt: new Date(),
        status: "active",
      };

      const res = await axiosSecure.post("/users", employeeInfo);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("Employee Registered Successfully ✅");
        reset();
        navigate(from, { replace: true });
      } else if (res.data?.message === "User already exists") {
        toast.error("This email already exists in database");
      } else {
        toast.error("Unexpected server response ⚠️");
      }
    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error?.code) {
        showFirebaseError(error);
      } else if (error?.response) {
        toast.error(error.response?.data?.message || "Backend server error ❌");
      } else {
        toast.error("Network or unknown server error ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-box shadow-xl border border-base-300 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FaUser className="text-primary" /> Employee Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Profile Picture *</label>
          <div className="relative">
            <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("profilePicture", {
                required: "Profile Picture is required",
              })}
            />
          </div>
          {errors.profilePicture && (
            <p className="text-error text-[10px] mt-1 font-bold">
              {errors.profilePicture.message}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Full Name *</label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="text"
              placeholder="Your Full Name"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("name", {
                required: "Full Name is required",
                minLength: { value: 3, message: "Minimum 3 characters required" },
              })}
            />
          </div>
          {errors.name && (
            <p className="text-error text-[10px] mt-1 font-bold">{errors.name.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Personal Email *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="email"
              placeholder="Email Address"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-error text-[10px] mt-1 font-bold">{errors.email.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Password *</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content z-50"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-[10px] mt-1 font-bold">{errors.password.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label text-xs font-bold uppercase tracking-wider opacity-60">Date of Birth *</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 z-10" />
            <input
              type="date"
              className={`input input-bordered w-full pl-12 rounded-xl h-12 ${focusStyle}`}
              {...register("dateOfBirth", {
                required: "Date of Birth is required",
              })}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-error text-[10px] mt-1 font-bold">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="btn btn-primary w-full mt-6 rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
        >
          {uploading ? (
            <>
              <span className="loading loading-spinner"></span>
              Registering...
            </>
          ) : (
            "Create Employee Account"
          )}
        </button>
      </form>

      <div className="divider text-[10px] font-black opacity-30 my-6 tracking-widest uppercase">OR SIGN UP WITH</div>

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
                role: "employee",
                createdAt: new Date(),
                status: "active",
              };
              await axiosSecure.post("/users", userInfo);
              toast.success("Google registration successful!");
              navigate("/employee/dashboard", { replace: true });
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
                  role: "employee",
                  createdAt: new Date(),
                  status: "active",
                };
                await axiosSecure.post("/users", userInfo);
                toast.success("Facebook registration successful!");
                navigate("/employee/dashboard", { replace: true });
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

export default EmployeeForm;
