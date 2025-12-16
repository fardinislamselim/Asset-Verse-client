import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const RequestAsset = () => {
  const axiosSecure = useAxiosSecure();

  const { data: assets = [], isPending } = useQuery({
    queryKey: ["available-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/available-assets");
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Available Assets</h1>

      {assets.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-600">No Assets Available</h2>
            <p className="text-gray-500 mt-2">Check back later for new inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                         <span className="text-white font-bold text-xl uppercase border-2 border-white px-4 py-1">Out of Stock</span>
                     </div>
                 )}
              </figure>
              <div className="card-body">
                <h2 className="card-title justify-between">
                    {asset.productName}
                </h2>
                
                <div className="flex flex-wrap gap-2 my-2">
                   <div className={`badge ${asset.productType === "Returnable" ? "badge-success" : "badge-secondary"} badge-outline font-medium`}>
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
      )}
    </div>
  );
};

export default RequestAsset;
