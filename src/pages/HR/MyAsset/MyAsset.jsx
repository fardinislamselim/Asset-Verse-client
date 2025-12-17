import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const AssetList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [deletingId, setDeletingId] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchInput(value);
        setCurrentPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const {
    data: response = {},
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["hr-assets", user?.email, searchInput, sortBy, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/assets?search=${searchInput}&sort=${sortBy}&page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
    keepPreviousData: true,
  });

  const { assets = [], pagination = {} } = response;
  const {
    currentPage: serverPage = 1,
    totalPages = 1,
    totalItems = 0,
    hasNext = false,
    hasPrev = false,
  } = pagination;

  const handleEditClick = (asset) => {
    setEditingAsset(asset);
    setFormData(asset);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
    setFormData({});
    setUploadingImage(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await axiosSecure.post("/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData((prev) => ({
        ...prev,
        productImage: res.data.url,
      }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveAsset = async () => {
    try {
      await axiosSecure.put(`/assets/${editingAsset._id}`, formData);
      toast.success("Asset updated successfully");
      handleModalClose();
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update asset");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        try {
          await axiosSecure.delete(`/assets/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Your asset has been deleted.",
            icon: "success",
          });
          refetch();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to delete asset");
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">My Assets</h1>
        <Link to="/hr/add-asset" className="btn btn-primary btn-lg">
          + Add New Asset
        </Link>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <label className="input input-bordered flex items-center gap-2 w-full max-w-md relative">
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
            {isFetching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner loading-sm"></span>
            )}
          </label>
          <div className="form-control w-full md:w-auto min-w-[200px]">
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="quantity-asc">Quantity (Low to High)</option>
              <option value="quantity-desc">Quantity (High to Low)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto bg-base-100 rounded-xl shadow-lg mb-10">
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
                  {isFetching ? "Searching..." : "No assets found."}
                </td>
              </tr>
            ) : (
              assets.map((asset, index) => (
                <tr key={asset._id} className="hover">
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  <td>
                    <img
                      src={asset.productImage || "/placeholder-image.jpg"}
                      alt={asset.productName}
                      className="w-14 h-14 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                    />
                  </td>
                  <td className="font-semibold">{asset.productName}</td>
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
                  <td>{new Date(asset.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEditClick(asset)}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </button>
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

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mb-10">
        {assets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-base-100 rounded-xl shadow-lg">
            {isFetching ? "Searching..." : "No assets found."}
          </div>
        ) : (
          assets.map((asset) => (
            <div
              key={asset._id}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={asset.productImage || "/placeholder-image.jpg"}
                    alt={asset.productName}
                    className="w-16 h-16 object-cover rounded-xl"
                    onError={(e) => (e.target.src = "/fallback-image.jpg")}
                  />
                  <div>
                    <h3 className="card-title text-lg">{asset.productName}</h3>
                    <p className="text-sm text-gray-500">
                      Added: {new Date(asset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Type</span>
                    <span
                      className={`badge mt-1 h-auto py-1 ${
                        asset.productType === "Returnable"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {asset.productType}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-semibold">
                      {asset.availableQuantity} / {asset.productQuantity}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-2">
                  <button
                    onClick={() => handleEditClick(asset)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalItems)} of {totalItems} assets
          </p>

          <div className="join">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={!hasPrev}
              className="join-item btn btn-sm"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="join-item btn btn-sm"
            >
              ‹ Prev
            </button>

            <button className="join-item btn btn-sm btn-disabled">
              Page {serverPage} / {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNext}
              className="join-item btn btn-sm"
            >
              Next ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={!hasNext}
              className="join-item btn btn-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Total Assets</div>
          <div className="stat-value text-primary">{totalItems}</div>
        </div>

        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Returnable</div>
          <div className="stat-value text-success">
            {assets.filter((a) => a.productType === "Returnable").length}
          </div>
        </div>

        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Non-returnable</div>
          <div className="stat-value text-error">
            {assets.filter((a) => a.productType === "Non-returnable").length}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg mb-4">Edit Asset</h3>

            <div className="space-y-4">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName || ""}
                onChange={handleFormChange}
                className="input input-bordered w-full"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <span className="text-sm text-gray-500">Uploading...</span>
                )}
                {formData.productImage && (
                  <img
                    src={formData.productImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
              <input
                type="number"
                name="productQuantity"
                placeholder="Total Quantity"
                value={formData.productQuantity || ""}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                min="0"
              />
              <input
                type="number"
                name="availableQuantity"
                placeholder="Available Quantity"
                value={formData.availableQuantity || ""}
                onChange={handleFormChange}
                className="input input-bordered w-full"
                min="0"
              />
              <select
                name="productType"
                value={formData.productType || ""}
                onChange={handleFormChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Type</option>
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
            </div>

            <div className="modal-action mt-6">
              <button onClick={handleModalClose} className="btn">
                Cancel
              </button>
              <button onClick={handleSaveAsset} className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={handleModalClose}
          >
            <button>Close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default AssetList;