import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaFilter, FaMapMarkerAlt, FaSearch, FaStar, FaTag } from "react-icons/fa";
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
        `/available-assets?search=${searchTerm}&sort=${sortBy}&page=${currentPage}&limit=8`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const assets = data?.assets || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="card bg-base-100 shadow-xl border border-base-200 h-full">
      <div className="h-56 bg-base-200 animate-pulse rounded-t-box w-full" />
      <div className="card-body p-5 space-y-3">
        <div className="h-6 bg-base-200 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-base-200 animate-pulse rounded w-full" />
        <div className="h-4 bg-base-200 animate-pulse rounded w-2/3" />
        <div className="flex gap-2 mt-4">
          <div className="h-4 bg-base-200 animate-pulse rounded w-1/3" />
          <div className="h-4 bg-base-200 animate-pulse rounded w-1/3" />
        </div>
        <div className="h-10 bg-base-200 animate-pulse rounded-field w-full mt-4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100 pb-12">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-neutral">
            Request <span className="text-primary">Assets</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Browse and request assets from your company inventory.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-base-100 p-4 rounded-2xl shadow-lg border border-base-200 max-w-4xl mx-auto">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="input input-bordered w-full pl-10 rounded-xl focus:outline-none focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-auto min-w-[220px]">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="select select-bordered w-full pl-10 rounded-xl focus:outline-none focus:border-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by Date (Newest)</option>
              <option value="asc">Quantity (Low to High)</option>
              <option value="desc">Quantity (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <h2 className="text-3xl font-bold text-neutral mb-2">No Assets Found</h2>
            <p className="text-gray-500">We couldn't find any assets matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${isPlaceholderData ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}>
              {assets.map((asset, idx) => (
                <motion.div
                  key={asset._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 group h-full flex flex-col"
                >
                  <figure className="relative h-56 overflow-hidden">
                    <img
                      src={asset.productImage}
                      alt={asset.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {asset.availableQuantity <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-bold text-sm uppercase tracking-wider border-2 border-white/50 px-4 py-1.5 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-base-100/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                      <FaStar className="text-warning" />
                      4.8
                    </div>
                  </figure>
                  
                  <div className="card-body p-5 flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="card-title text-lg font-bold text-neutral group-hover:text-primary transition-colors line-clamp-1">
                        {asset.productName}
                      </h3>
                      <span className={`badge ${asset.productType === "Returnable" ? "bg-green-100 text-green-700 border-0" : "bg-amber-100 text-amber-700 border-0"} badge-sm py-2 font-medium whitespace-nowrap flex-shrink-0`}>
                        {asset.productType === "Returnable" ? "Returnable" : "Non-Returnable"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow-0 min-h-[40px]">
                      High-quality {asset.productName.toLowerCase()} provided by {asset.companyName}. Request this asset for your work needs.
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 mt-auto mb-4 border-t border-base-200 pt-3">
                      <div className="flex items-center gap-1.5">
                        <FaTag className="text-primary" />
                        <span>Qty: {asset.availableQuantity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-primary" />
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span>{asset.companyName || "Main Warehouse"}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <Link 
                        to={`/employee/asset-details/${asset._id}`}
                        className="btn btn-primary btn-block rounded-field shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div className="join shadow-md bg-base-100 border border-base-200">
                <button
                  className="join-item btn btn-md hover:bg-base-200"
                  disabled={!pagination.hasPrev || isPlaceholderData}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                <button className="join-item btn btn-md bg-base-100 cursor-default no-animation">
                  Page {currentPage} of {pagination.totalPages}
                </button>
                <button
                  className="join-item btn btn-md hover:bg-base-200"
                  disabled={!pagination.hasNext || isPlaceholderData}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestAsset;
