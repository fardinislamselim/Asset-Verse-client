import React from "react";
import { useForm } from "react-hook-form";
import {
  FaBoxOpen,
  FaBuilding,
  FaCalculator,
  FaCalendarAlt,
  FaImage,
  FaInfoCircle,
  FaListAlt,
  FaPlusSquare,
  FaTag,
  FaUser,
} from "react-icons/fa";
import useAuth from "../../../hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import toast from "react-hot-toast";

const AddAsset = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: hr = {}, isPending: isHrLoading } = useQuery({
    queryKey: ["hrProfile", user?.email],
    queryFn: async () => {
      if (!user?.email) return {};
      const res = await axiosSecure.get("/user");
      return res.data[0] || res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const imageFile = formData.productImage[0];
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: imgData,
        }
      );

      const imgResult = await imgRes.json();
      const imageUrl = imgResult.data.display_url;

      const assetData = {
        ...formData,
        productImage: imageUrl,
        hrEmail: hr.email,
        companyName: hr.companyName,
        dateAdded: new Date().toISOString(),
        availableQuantity: formData.productQuantity,
      };

      const result = await axiosSecure.post("/assets", assetData);

      if (result.data.insertedId) {
        toast.success("Asset registered successfully");
        reset();
      }
    } catch (error) {
      toast.error("Failed to add asset",error);
    }
  };

  if (loading || isHrLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg">Fetching HR data...</p>
      </div>
    );
  }

  if (!hr.email || !hr.companyName) {
    return (
      <div className="alert alert-warning">
        <FaInfoCircle />
        <div>
          <h3 className="font-bold">Missing HR Data</h3>
          <p className="text-sm">
            User profile data could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-base-100 min-h-full rounded-lg shadow-xl">
      <header className="mb-8 border-b pb-4 border-base-200 text-center">
        <h1 className="text-3xl font-bold text-primary flex justify-center items-center">
          <FaPlusSquare className="mr-3 text-2xl hidden sm:block" /> Add New Company Asset
        </h1>
        <p className="text-base-content/70 mt-1">
          Register a new product in the company inventory.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-base-200 rounded-lg shadow-inner">
          <h2 className="md:col-span-2 text-xl font-semibold mb-2 text-secondary flex items-center">
            <FaBoxOpen className="mr-2" /> Product Identification
          </h2>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center">
                <FaTag className="mr-2" /> Product Name
              </span>
            </div>
            <input
              type="text"
              className={`input input-bordered w-full ${
                errors.productName ? "input-error" : ""
              }`}
              {...register("productName", { required: true, minLength: 3 })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center">
                <FaCalculator className="mr-2" /> Asset Type
              </span>
            </div>
            <select
              className={`select select-bordered w-full ${
                errors.productType ? "select-error" : ""
              }`}
              defaultValue=""
              {...register("productType", { required: true })}
            >
              <option value="" disabled>
                Select Asset Type
              </option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </label>

          <label className="form-control md:col-span-2">
            <div className="label">
              <span className="label-text flex items-center">
                <FaImage className="mr-2" /> Product Image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full ${
                errors.productImage ? "file-input-error" : ""
              }`}
              {...register("productImage", { required: true })}
            />
          </label>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-base-200 rounded-lg shadow-inner">
          <h2 className="md:col-span-3 text-xl font-semibold mb-2 text-secondary flex items-center">
            <FaListAlt className="mr-2" /> Inventory & Metadata
          </h2>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center">
                <FaCalculator className="mr-2" /> Quantity
              </span>
            </div>
            <input
              type="number"
              className={`input input-bordered w-full ${
                errors.productQuantity ? "input-error" : ""
              }`}
              {...register("productQuantity", { required: true, min: 1 })}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center">
                <FaCalendarAlt className="mr-2" /> Date Added
              </span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full bg-base-300"
              defaultValue={new Date().toISOString().substring(0, 10)}
              readOnly
              {...register("dateAdded")}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text flex items-center">
                <FaUser className="mr-2" /> HR Email
              </span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full bg-base-300"
              value={hr.email}
              readOnly
              {...register("hrEmail")}
            />
          </label>

          <div className="md:col-span-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text flex items-center">
                  <FaBuilding className="mr-2" /> Company
                </span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full bg-base-300 font-semibold"
                value={hr.companyName}
                readOnly
                {...register("companyName")}
              />
            </label>
          </div>
        </section>

        <div className=" pt-4 text-center">
          <button type="submit" className="btn btn-lg btn-primary">
            <FaPlusSquare className="mr-2" /> Register Asset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAsset;