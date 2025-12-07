import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router";
import {
  FaUser,
  FaImage,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import useAuth from "../../hook/useAuth";

const EmployeeForm = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Password toggle state

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const focusStyle = "focus:outline-none focus:border-transparent focus:ring-2 focus:ring-primary";

  const showFirebaseError = (error) => {
    let message = "Something went wrong ❌";
    if (!error?.code) {
      message = error?.message || message;
    } else {
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered 📧";
          break;
        case "auth/invalid-email":
          message = "Invalid email address ❌";
          break;
        case "auth/weak-password":
          message = "Password is too weak 🔒";
          break;
        case "auth/network-request-failed":
          message = "Network error, please try again 🌐";
          break;
        default:
          message = error.message || message;
      }
    }
    toast.error(message);
  };

  const onSubmit = (data) => {
    setUploading(true);

    const profileImg = data.profilePicture[0];

    registerUser(data.email, data.password)
      .then(() => {
        const formData = new FormData();
        formData.append("image", profileImg);

        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`;

        axios.post(image_API_URL, formData)
          .then((res) => {
            const userProfile = {
              displayName: data.name,
              photoURL: res.data.data.url,
            };

            updateUserProfile(userProfile)
              .then(() => {
                toast.success("Employee Registered Successfully ✅");
                reset();
                setUploading(false);
              })
              .catch((err) => {
                showFirebaseError(err);
                setUploading(false);
              });
          })
          .catch(() => {
            toast.error("Image upload failed ❌");
            setUploading(false);
          });
      })
      .catch((err) => {
        showFirebaseError(err);
        setUploading(false);
      });
  };

  return (
    <div className="p-6 bg-base-200 rounded-2xl shadow-xl border border-base-300">
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <FaUser className="text-primary" /> Employee Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Profile Picture */}
        <div className="form-control">
          <label className="label font-medium">Profile Picture *</label>
          <div className="relative">
            <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full pl-10 ${focusStyle}`}
              {...register("profilePicture", { required: "Profile Picture is required" })}
            />
          </div>
          {errors.profilePicture && <p className="text-error text-sm mt-1">{errors.profilePicture.message}</p>}
        </div>

        {/* Full Name */}
        <div className="form-control">
          <label className="label font-medium">Full Name *</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Full Name"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("name", { required: "Full Name is required" })}
            />
          </div>
          {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label font-medium">Personal Email *</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="email"
              placeholder="Email Address"
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
          {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label font-medium">Password *</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
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
          {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
        </div>

        {/* Date of Birth */}
        <div className="form-control">
          <label className="label font-medium">Date of Birth *</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input
              type="date"
              className={`input input-bordered w-full pl-10 ${focusStyle}`}
              {...register("dateOfBirth", { required: "Date of Birth is required" })}
            />
          </div>
          {errors.dateOfBirth && <p className="text-error text-sm">{errors.dateOfBirth.message}</p>}
        </div>

        {/* Submit */}
        <button type="submit" disabled={uploading} className="btn btn-primary w-full mt-4">
          {uploading ? "Registering..." : "Register as Employee"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-primary font-semibold underline">Login</Link>
      </p>
    </div>
  );
};

export default EmployeeForm;
