import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { toast } from "react-hot-toast";
import { FiCamera } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

const HRProfile = () => {
  const { user: authUser, loading: authLoading, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    data: hr = {},
    isPending: hrLoading,
    refetch,
  } = useQuery({
    queryKey: ["hrProfile", authUser?.email],
    queryFn: async () => {
      if (!authUser?.email) return {};
      const res = await axiosSecure.get("/user");
      return res.data;
    },
    enabled: !!authUser?.email,
  });

  useEffect(() => {
    if (hr) {
      setName(hr.name || authUser?.displayName || "");
      setDateOfBirth(hr.dateOfBirth || "");
      setCompanyLogo(hr.companyLogo || "");
    }
  }, [hr, authUser]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.success && data.data?.url) {
        setCompanyLogo(data.data.url);
        toast.success("Company logo uploaded!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Upload failed. Check your connection.", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        displayName: name.trim(),
        photoURL: companyLogo,
      });

      await axiosSecure.patch("/user/profile", {
        name: name.trim(),
        dateOfBirth,
        companyLogo,
      });

      toast.success("Profile updated successfully!");
      refetch(); // Refresh user data
    } catch (err) {
      toast.error("Failed to save profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || hrLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12">HR Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="bg-base-100 shadow-xl rounded-2xl p-8 text-center">
          <div className="relative w-48 mx-auto mb-6">
            <img
              src={companyLogo || "/default-company-logo.jpg"}
              alt="Company Logo"
              className="w-48 h-48 rounded-full object-cover ring-8 ring-primary ring-offset-4 ring-offset-base-100"
            />

            <label className="absolute bottom-4 right-4 bg-primary text-white p-4 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition">
              <FiCamera size={24} />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-white"></span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mt-6">
            {hr.companyName || "Your Company"}
          </h2>
          <p className="text-gray-600 mt-2">{hr.email}</p>

          <div className="mt-10 bg-base-200 rounded-2xl p-6 shadow-inner">
            <h3 className="text-xl font-semibold mb-4">Subscription Details</h3>
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span className="font-medium">Current Package:</span>
                <span className="badge badge-primary badge-lg">
                  {hr.subscription || "Basic"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employee Limit:</span>
                <span className="font-bold text-xl">
                  {hr.packageLimit || 5}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employees Used:</span>
                <span className="font-bold text-xl text-primary">
                  {hr.currentEmployees || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl rounded-2xl">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-8">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Email Address
                    </span>
                  </label>
                  <input
                    type="email"
                    value={hr.email || ""}
                    className="input input-bordered input-lg bg-base-200"
                    readOnly
                    disabled
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Company Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={hr.companyName || ""}
                    className="input input-bordered input-lg bg-base-200"
                    readOnly
                    disabled
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered input-lg"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold text-lg">
                      Date of Birth
                    </span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="input input-bordered input-lg"
                  />
                </div>
              </div>

              <div className="card-actions mt-10">
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRProfile;
