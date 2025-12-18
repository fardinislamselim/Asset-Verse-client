
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { toast } from "react-hot-toast";

const EditAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productImage: "",
    productType: "Returnable",
    productQuantity: 1,
  });

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await axiosSecure.get(`/assets`);
        const asset = res.data.find((a) => a._id === id);
        if (asset) {
          setFormData({
            productName: asset.productName,
            productImage: asset.productImage,
            productType: asset.productType,
            productQuantity: asset.productQuantity,
          });
        } else {
          toast.error("Asset not found");
          navigate("/hr/my-asset");
        }
      } catch (err) {
        toast.error("Failed to load asset", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchAsset();
  }, [id, axiosSecure, navigate, user?.email]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const imgData = new FormData();
    imgData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        {
          method: "POST",
          body: imgData,
        }
      );
      const data = await res.json();
      if (data?.data?.url) {
        setFormData({ ...formData, productImage: data.data.url });
        toast.success("Image updated!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Upload error", err);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productImage) {
      toast.error("Please upload an image");
      return;
    }

    setSaving(true);
    try {
      await axiosSecure.put(`/assets/${id}`, {
        productName: formData.productName,
        productImage: formData.productImage,
        productType: formData.productType,
        productQuantity: Number(formData.productQuantity),
      });
      toast.success("Asset updated successfully!");
      navigate("/hr/my-asset");
    } catch (err) {
      toast.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Edit Asset</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-base-200 p-8 rounded-xl shadow-lg"
      >
        
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Product Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered input-lg"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Product Image</span>
          </label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered file-input-primary w-full"
            />
            {imageUploading && (
              <progress className="progress progress-primary w-full"></progress>
            )}
            {formData.productImage && (
              <div className="flex justify-center">
                <img
                  src={formData.productImage}
                  alt="Current"
                  className="max-w-sm rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Asset Type</span>
            </label>
            <select
              className="select select-bordered select-lg"
              value={formData.productType}
              onChange={(e) =>
                setFormData({ ...formData, productType: e.target.value })
              }
            >
              <option value="Returnable">Returnable</option>
              <option value="Non-returnable">Non-returnable</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Total Quantity</span>
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered input-lg"
              value={formData.productQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productQuantity: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/hr/assets")}
            className="btn btn-outline btn-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || imageUploading}
            className="btn btn-primary btn-lg"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner"></span> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAsset;
