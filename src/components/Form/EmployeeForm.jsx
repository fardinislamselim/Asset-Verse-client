import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router";
const EmployeeForm = () => {
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;
  const uploadURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

  const onSubmit = async (data) => {
    setUploading(true);
    const formData = new FormData();

    formData.append("image", data.profilePicture[0]);

    const imgResp = await axios.post(uploadURL, formData);
    const photoURL = imgResp.data.data.url;

    const employeeData = {
      ...data,
      profilePicture: photoURL,
      role: "employee",
    };

    console.log("Employee Data:", employeeData);
    toast.success("Employee Registration Successful!");
    reset();
    setUploading(false);
  };

  return (
    <div className="p-4 bg-base-200 rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Employee Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Picture Upload */}
        <div className="form-control w-full">
          <label htmlFor="profilePicture" className="label">
            <span className="label-text font-medium">Profile Picture *</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("profilePicture", {
              required: "Profile Picture is required",
            })}
            id="profilePicture"
          />
          {errors.profilePicture && (
            <p className="text-error text-sm mt-1">
              {errors.profilePicture.message}
            </p>
          )}
        </div>

        <div className="divider my-2">Personal Info</div>

        {/* Full Name */}
        <div className="form-control w-full">
          <label htmlFor="name" className="label">
            <span className="label-text font-medium">Full Name *</span>
          </label>
          <input
            type="text"
            placeholder="Your Full Name"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("name", { required: "Full Name is required" })}
            id="name"
          />
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-control w-full">
          <label htmlFor="email" className="label">
            <span className="label-text font-medium">Personal Email *</span>
          </label>
          <input
            type="email"
            placeholder="Personal Email Address"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            id="email"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control w-full">
          <label htmlFor="password" className="label">
            <span className="label-text font-medium">Password *</span>
          </label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            id="password"
          />
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="form-control w-full">
          <label htmlFor="dateOfBirth" className="label">
            <span className="label-text font-medium">Date of Birth *</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
            id="dateOfBirth"
          />
          {errors.dateOfBirth && (
            <p className="text-error text-sm mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full mt-6"
          disabled={uploading}
        >
          {uploading ? "Uploading Image..." : "Register as Employee"}
        </button>
      </form>
      <p className="text-sm text-center mt-2">
        already have an account?{" "}
        <Link to={"/login"} className="text-primary underline">
          login
        </Link>
      </p>
    </div>
  );
};

export default EmployeeForm;
