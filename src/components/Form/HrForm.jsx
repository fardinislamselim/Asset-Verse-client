import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router";

const HrForm = () => {
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm();

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;
  const uploadURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

  const onSubmit = async (data) => {
    // Upload Company Logo to ImgBB
    const formData = new FormData();
    formData.append("image", data.companyLogo[0]);

    const imgResp = await axios.post(uploadURL, formData);
    const logoURL = imgResp.data.data.url;

    //repare HR Data (Assignment Requirement)
    const hrData = {
      name: data.name,
      companyName: data.companyName,
      companyLogo: logoURL,
      email: data.email,
      password: data.password,
      dateOfBirth: data.dateOfBirth,

      // Auto-assigned fields
      role: "hr",
      packageLimit: 5,
      currentEmployees: 0,
      subscription: "basic",
    };

    console.log("HR Data to be sent to server:", hrData);
  };

  return (
    <div className="p-6 bg-base-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">HR Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Full Name *</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-error text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Company Name *</span>
          </label>
          <input
            id="companyName"
            type="text"
            placeholder="Company Name"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40 "
            {...register("companyName", {
              required: "Company name is required",
            })}
          />
          {errors.companyName && (
            <p className="text-error text-sm">{errors.companyName.message}</p>
          )}
        </div>

        {/* Company Logo */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Company Logo *</span>
          </label>
          <input
            id="companyLogo"
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            {...register("companyLogo", {
              required: "Company Logo is required",
            })}
          />
          {errors.companyLogo && (
            <p className="text-error text-sm">{errors.companyLogo.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Official Email *</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Official Email"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password *</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
            })}
          />
          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* DOB */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date of Birth *</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className="input input-bordered w-full focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-40"
            {...register("dateOfBirth", {
              required: "Date of Birth is required",
            })}
          />
          {errors.dateOfBirth && (
            <p className="text-error text-sm">{errors.dateOfBirth.message}</p>
          )}
        </div>
        {/* Submit */}
        <button className="btn btn-primary w-full">Register as HR</button>
      </form>
      <p className="text-sm text-center mt-2">already have an account? <Link to={"/login"}className='text-primary underline'>login</Link></p>
    </div>
  );
};

export default HrForm;
