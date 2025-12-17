import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const MyAssets = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const {
    data: assets = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["employee-my-assets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-assets");
      return res.data;
    },
  });

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.assetName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "all" || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  const handleReturn = async (id) => {
    if (!confirm("Return this asset?")) return;

    try {
      await axiosSecure.patch(`/assigned-assets/${id}/return`);
      toast.success("Asset returned!");
      refetch();
    } catch (err) {
      toast.error("Return failed", err.message);
    }
  };

  if (isPending) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Assets</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by asset name..."
          className="input input-bordered w-full md:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-64"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          No assets assigned yet
        </div>
      ) : (
        <>
          
          <div className="hidden lg:block overflow-x-auto bg-base-100 rounded-xl shadow-lg">
            <table className="table table-zebra">
              <thead className="bg-base-200">
                <tr>
                  <th>Image</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Company</th>
                  <th>Assigned Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset._id}>
                    <td>
                      <img
                        src={asset.assetImage}
                        alt={asset.assetName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="font-medium">{asset.assetName}</td>
                    <td>
                      <span
                        className={`badge ${
                          asset.assetType === "Returnable"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {asset.assetType}
                      </span>
                    </td>
                    <td>{asset.companyName}</td>
                    <td>{new Date(asset.assignmentDate).toLocaleDateString()}</td>
                    <td>
                      {asset.assetType === "Returnable" && (
                        <button
                          onClick={() => handleReturn(asset._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredAssets.map((asset) => (
              <div key={asset._id} className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={asset.assetImage}
                      alt={asset.assetName}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div>
                      <h3 className="card-title text-base">{asset.assetName}</h3>
                      <p className="text-xs text-gray-500">{asset.companyName}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500">Type:</span>
                    <span
                      className={`badge badge-sm ${
                        asset.assetType === "Returnable"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {asset.assetType}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-500">Assigned:</span>
                    <span className="font-medium">
                      {new Date(asset.assignmentDate).toLocaleDateString()}
                    </span>
                  </div>

                  {asset.assetType === "Returnable" && (
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => handleReturn(asset._id)}
                        className="btn btn-sm btn-warning w-full"
                      >
                        Return Asset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyAssets;
