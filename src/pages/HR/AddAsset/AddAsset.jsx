import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router";
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
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const AddAsset = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const imageHostKey = import.meta.env.VITE_IMGBB_API_KEY;
  const uploadURL = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

  const onSubmit = async (formData) => {
    try {
      setUploading(true);

      const imageFile = formData.productImage[0];
      if (!imageFile) {
        toast.error("Please select an image");
        return;
      }

      // Upload image to ImgBB
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const imgRes = await axios.post(uploadURL, imgData);
      if (!imgRes.data.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imgRes.data.data.display_url;

      // Prepare asset data
      const assetData = {
        productName: formData.productName.trim(),
        productImage: imageUrl,
        productType: formData.productType,
        productQuantity: Number(formData.productQuantity),
        dateAdded: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        hrEmail: user.email,
        companyName: user.companyName || "My Company",
      };

      // Save asset to backend
      const result = await axiosSecure.post("/assets", assetData);

      if (result.data.insertedId || result.data.acknowledged) {
        toast.success("✅ Asset added successfully!");

        // 🔥 FIX: Invalidate cache so AssetList updates instantly
        queryClient.invalidateQueries({ queryKey: ["hr-assets"] });

        reset();

        // Optional: Redirect to asset list
        // navigate("/hr/assets");
      } else {
        toast.error("Asset saved but no confirmation from server");
      }
    } catch (error) {
      console.error("Add Asset Error:", error);
      toast.error(
        error?.response?.data?.message || error.message || "Failed to add asset"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-3 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-base-100 min-h-full rounded-lg shadow-xl">
      <header className="mb-8 border-b pb-4 border-base-200 text-center">
        <h1 className="text-3xl font-bold text-primary flex justify-center items-center gap-3">
          <FaPlusSquare className="text-4xl" /> Add New Company Asset
        </h1>
        <p className="text-base-content/70 mt-2">
          Register a new product in your company inventory.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Identification */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-base-200 rounded-lg shadow-inner">
          <h2 className="md:col-span-2 text-xl font-semibold mb-2 text-secondary flex items-center gap-2">
            <FaBoxOpen /> Product Identification
          </h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaTag /> Product Name *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro"
              className={`input input-bordered w-full ${
                errors.productName ? "input-error" : ""
              }`}
              {...register("productName", {
                required: "Product name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />
            {errors.productName && (
              <p className="text-error text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaCalculator /> Asset Type *
              </span>
            </label>
            <select
              className={`select select-bordered w-full ${
                errors.productType ? "select-error" : ""
              }`}
              defaultValue=""
              {...register("productType", { required: "Please select type" })}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
            {errors.productType && (
              <p className="text-error text-sm mt-1">
                {errors.productType.message}
              </p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaImage /> Product Image *
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              className={`file-input file-input-bordered w-full ${
                errors.productImage ? "file-input-error" : ""
              }`}
              {...register("productImage", { required: "Image is required" })}
            />
            {errors.productImage && (
              <p className="text-error text-sm mt-1">
                {errors.productImage.message}
              </p>
            )}
          </div>
        </section>

        {/* Inventory Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-base-200 rounded-lg shadow-inner">
          <h2 className="md:col-span-3 text-xl font-semibold mb-2 text-secondary flex items-center gap-2">
            <FaListAlt /> Inventory Details
          </h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaCalculator /> Quantity *
              </span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 10"
              className={`input input-bordered w-full ${
                errors.productQuantity ? "input-error" : ""
              }`}
              {...register("productQuantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum 1" },
              })}
            />
            {errors.productQuantity && (
              <p className="text-error text-sm mt-1">
                {errors.productQuantity.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaCalendarAlt /> Date Added
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-base-300"
              value={new Date().toISOString().substring(0, 10)}
              readOnly
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaUser /> Added By
              </span>
            </label>
            <input
              type="text"
              value={user?.name || user?.email || "HR"}
              className="input input-bordered w-full bg-base-300"
              readOnly
            />
          </div>
        </section>

        {/* Submit */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={uploading}
            className="btn btn-primary btn-lg px-10"
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner"></span>
                Adding Asset...
              </>
            ) : (
              <>
                <FaPlusSquare className="mr-2" />
                Register Asset
              </>
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-8">
        <Link to="/hr/my-asset" className="link link-primary">
          ← Back to Asset List
        </Link>
      </div>
    </div>
  );
};

export default AddAsset;
