import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AssetCard, { AssetCardSkeleton } from "../../components/AssetCard";
import useAxiosPublic from "../../hook/useAxiosPublic";

const AvailableAssets = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [assetType, setAssetType] = useState("");
  const [stockStatus, setStockStatus] = useState("available");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isPending, isPlaceholderData } = useQuery({
    queryKey: ["available-assets", searchTerm, sortBy, assetType, stockStatus, currentPage],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/available-assets?search=${searchTerm}&sort=${sortBy}&type=${assetType}&stock=${stockStatus}&page=${currentPage}&limit=12`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const assets = data?.assets || [];
  const pagination = data?.pagination || {};

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, assetType, stockStatus]);

  return (
    <div className="p-6 max-w-7xl mx-auto pt-24 lg:pt-32 pb-20">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-primary">
          Available Assets
        </h1>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Explore our wide range of company assets. Filter by category, availability, and more to find exactly what you're looking for.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <div className="form-control w-full">
          <label className="label text-xs font-bold uppercase opacity-50">Search</label>
          <input
            type="text"
            placeholder="Asset name..."
            className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label text-xs font-bold uppercase opacity-50">Type</label>
          <select
            className="select select-bordered w-full rounded-xl"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label text-xs font-bold uppercase opacity-50">Availability</label>
          <select
            className="select select-bordered w-full rounded-xl"
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
          >
            <option value="available">In Stock Only</option>
            <option value="all">Show All Items</option>
          </select>
        </div>

        <div className="form-control w-full">
          <label className="label text-xs font-bold uppercase opacity-50">Sort By</label>
          <select
            className="select select-bordered w-full rounded-xl"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Newest Added</option>
            <option value="date-asc">Oldest Added</option>
            <option value="qty-desc">Quantity (High to Low)</option>
            <option value="qty-asc">Quantity (Low to High)</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <AssetCardSkeleton key={i} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center bg-base-100 rounded-3xl border-2 border-dashed border-base-200">
          <div className="text-7xl mb-6">📦</div>
          <h2 className="text-3xl font-bold text-base-content">
            No Assets Found
          </h2>
          <p className="text-base-content/60 mt-3 text-lg">
            Try adjusting your search filters or browse other categories.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
              isPlaceholderData ? "opacity-50" : "opacity-100"
            } transition-opacity duration-300`}
          >
            {assets.map((asset) => (
              <AssetCard 
                key={asset._id} 
                asset={asset} 
                detailsLink={`/assets/${asset._id}`}
              />
            ))}
          </div>

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

export default AvailableAssets;
