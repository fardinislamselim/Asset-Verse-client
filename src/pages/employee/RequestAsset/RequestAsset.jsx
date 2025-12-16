import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const RequestAsset = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isPending, isPlaceholderData } = useQuery({
    queryKey: ["available-assets", searchTerm, sortBy, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/available-assets?search=${searchTerm}&sort=${sortBy}&page=${currentPage}&limit=9`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const assets = data?.assets || [];
  const pagination = data?.pagination || {};

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Available Assets
      </h1>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        <div className="form-control w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by asset name..."
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-control w-full md:w-auto min-w-[200px]">
          <select
            className="select select-bordered w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by Date (Newest)</option>
            <option value="asc">Quantity (Low to High)</option>
            <option value="desc">Quantity (High to Low)</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-600">
            No Assets Found
          </h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search filters.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${
              isPlaceholderData ? "opacity-50" : "opacity-100"
            } transition-opacity duration-200`}
          >
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200"
              >
                <figure className="px-6 pt-6 h-56 relative overflow-hidden">
                  <img
                    src={asset.productImage}
                    alt={asset.productName}
                    className="rounded-xl h-full w-full object-cover transition-transform hover:scale-105"
                  />
                  {asset.availableQuantity <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <span className="text-white font-bold text-xl uppercase border-2 border-white px-4 py-1">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title justify-between">
                    {asset.productName}
                  </h2>

                  <div className="flex flex-wrap gap-2 my-2">
                    <div
                      className={`badge ${
                        asset.productType === "Returnable"
                          ? "badge-success"
                          : "badge-secondary"
                      } badge-outline font-medium`}
                    >
                      {asset.productType}
                    </div>
                    <div className="badge badge-ghost">{asset.companyName}</div>
                  </div>

                  <div className="mt-2 text-sm text-gray-500 font-medium">
                    Available: {asset.availableQuantity}
                  </div>

                  <div className="card-actions mt-auto pt-4">
                    <Link
                      to={`/employee/asset-details/${asset._id}`}
                      className="btn btn-primary w-full"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="join">
              <button
                className="join-item btn"
                disabled={!pagination.hasPrev || isPlaceholderData}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                «
              </button>
              <button className="join-item btn">
                Page {currentPage} of {pagination.totalPages || 1}
              </button>
              <button
                className="join-item btn"
                disabled={!pagination.hasNext || isPlaceholderData}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RequestAsset;
