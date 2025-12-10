import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

const AssetList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 500),
    []
  );

  const {
    data: assets = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["hr-assets", user?.email, search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets?search=${search}`);
      return res.data;
    },
    enabled: !!user?.email,
    placeholderData: (prev) => prev,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    setDeletingId(id);
    try {
      await axiosSecure.delete(`/assets/${id}`);
      toast.success("Asset deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete asset");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">My Assets</h1>
        <Link to="/hr/add-asset" className="btn btn-primary btn-lg">
          + Add New Asset
        </Link>
      </div>

      <div className="mb-8">
        <label className="input input-bordered flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            className="grow"
            placeholder="Search assets by name..."
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-5 h-5 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">
        <table className="table table-zebra">
          <thead className="bg-base-200 text-base">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Asset Name</th>
              <th>Type</th>
              <th className="text-center">Total Qty</th>
              <th className="text-center">Available</th>
              <th>Added On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 text-gray-500">
                  No assets added yet.
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => (
                <tr key={asset._id} className="hover">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={asset.productImage || "/placeholder-image.jpg"}
                      alt={asset.productName}
                      className="w-14 h-14 object-cover rounded-lg"
                      onError={(e) =>
                        (e.target.src = "/fallback-image.jpg")
                      }
                    />
                  </td>
                  <td className="font-semibold">
                    {asset.productName}
                  </td>
                  <td>
                    <span
                      className={`badge badge-lg ${
                        asset.productType === "Returnable"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {asset.productType}
                    </span>
                  </td>
                  <td className="text-center font-medium">
                    {asset.productQuantity}
                  </td>
                  <td className="text-center font-bold text-primary">
                    {asset.availableQuantity}
                  </td>
                  <td>
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2">
                    <Link
                      to={`/hr/edit-asset/${asset._id}`}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      disabled={deletingId === asset._id}
                      className="btn btn-sm btn-error"
                    >
                      {deletingId === asset._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Total Assets</div>
          <div className="stat-value text-primary">
            {assets.length}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Returnable</div>
          <div className="stat-value text-success">
            {assets.filter(
              (a) => a.productType === "Returnable"
            ).length}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Non-returnable</div>
          <div className="stat-value text-error">
            {assets.filter(
              (a) => a.productType === "Non-returnable"
            ).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetList;
