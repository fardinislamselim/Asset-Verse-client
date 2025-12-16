import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [note, setNote] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  // Fetch asset details
  const { data: asset, isPending, isError } = useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const handleRequest = async () => {
    if (!note.trim()) {
      toast.error("Please add a note to explain why you need this asset.");
      return;
    }

    setRequestLoading(true);
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
      navigate("/employee/request-asset"); // Redirect back to list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send request.");
    } finally {
      setRequestLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-bold text-error">Asset Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const isOutOfStock = asset.availableQuantity <= 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost mb-6"
      >
        ← Back to Assets
      </button>

      <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden border border-base-200">
        <figure className="lg:w-1/2 h-96 lg:h-auto overflow-hidden">
          <img
            src={asset.productImage}
            alt={asset.productName}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </figure>
        
        <div className="card-body lg:w-1/2 p-8">
          <div className="flex justify-between items-start">
            <div>
               <h1 className="card-title text-4xl mb-2">{asset.productName}</h1>
               <p className="text-gray-500 font-medium text-lg mb-4">{asset.companyName}</p>
            </div>
             <div className={`badge ${asset.productType === "Returnable" ? "badge-success" : "badge-error"} badge-lg`}>
                {asset.productType}
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-4 mb-6">
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div className="stat-title">Availability</div>
                <div className={`stat-value ${isOutOfStock ? "text-error" : "text-primary"}`}>
                    {isOutOfStock ? "Out of Stock" : `${asset.availableQuantity} Available`}
                </div>
                <div className="stat-desc">Stock update live</div>
              </div>
            </div>
            
            <p className="text-base-content/70">
                This asset is provided by <strong>{asset.companyName}</strong>. 
                Please ensure you read the policy regarding <strong>{asset.productType}</strong> items before requesting.
            </p>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-lg font-semibold">Additional Note</span>
              <span className="label-text-alt text-error">* Required</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-32 text-base"
              placeholder="Why do you need this asset? e.g. My current laptop is broken."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isOutOfStock}
            ></textarea>
          </div>

          <div className="card-actions justify-end mt-8">
            <button
              onClick={handleRequest}
              className="btn btn-primary btn-lg w-full"
              disabled={isOutOfStock || requestLoading}
            >
              {requestLoading ? (
                <span className="loading loading-spinner"></span>
              ) : isOutOfStock ? (
                "Not Available"
              ) : (
                "Request Asset"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
