import React, { useState } from "react";
import { toast } from "react-hot-toast";

import useAxiosSecure from "../../hook/useAxiosSecure";
import useAuth from "../../hook/useAuth";

const Profile = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(
    user?.profileImage || "/default-avatar.jpg"
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.data.url) {
        setPreview(data.data.url);

        await axiosSecure.patch("/user/profile", {
          profileImage: data.data.url,
        });
        toast.success("Profile picture updated!");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">My Profile</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="avatar mb-6">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
              <img src={preview} alt="Profile" />
            </div>
          </div>

          <h2 className="card-title text-2xl">{user?.displayName || "User"}</h2>
          <p className="text-gray-600">{user?.email}</p>

          <div className="mt-8">
            <label className="btn btn-primary">
              {uploading ? "Uploading..." : "Change Profile Picture"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploading && (
            <progress className="progress progress-primary w-56 mt-4"></progress>
          )}
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500">
        <p>
          Your current affiliations and assets are managed through the
          dashboard.
        </p>
      </div>
    </div>
  );
};

export default Profile;
