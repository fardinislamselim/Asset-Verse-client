import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAuth from "../../../hook/useAuth";

const RequestAsset = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedAsset, setSelectedAsset] = useState(null);

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
      <h1 className="text-4xl font-bold mb-8 text-center">Request an Asset</h1>

      {assets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No assets available for request right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset) => (
            <div
              key={asset._id}
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition"
            >
              <figure className="px-6 pt-6">
                <img
                  src={asset.productImage}
                  alt={asset.productName}
                  className="rounded-sm h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{asset.productName}</h2>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`badge ${
                      asset.productType === "Returnable"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {asset.productType}
                  </span>
                  <span className="badge badge-primary badge-outline">
                    Available: {asset.availableQuantity}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Company: {asset.companyName}
                </p>

                <div className="card-actions mt-4">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="btn btn-primary w-full"
                    disabled={asset.availableQuantity === 0}
                  >
                    Request This Asset
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAsset && (
        <RequestModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          refetch={() => {}}
        />
      )}
    </div>
  );
};

// Modal Component
const RequestModal = ({ asset, onClose }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) {
      toast.error("Please add a note");
      return;
    }

    setLoading(true);
    try {
      await axiosSecure.post("/requests", {
        assetId: asset._id,
        assetName: asset.productName,
        assetType: asset.productType,
        companyName: asset.companyName,
        hrEmail: asset.hrEmail,
        requesterName: user.displayName,
        requesterEmail: user.email,
        note,
      });
      toast.success("Request sent successfully!");
      onClose();
    } catch (err) {
      toast.error("Request failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-2xl mb-4">
          Request: {asset.productName}
        </h3>
        <img
          src={asset.productImage}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="mb-2">
          <strong>Type:</strong> {asset.productType}
        </p>
        <p className="mb-4">
          <strong>Company:</strong> {asset.companyName}
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Add a note (required)</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32"
            placeholder="Why do you need this asset?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Send Request"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAsset;
