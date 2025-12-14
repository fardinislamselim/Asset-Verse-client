import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();

  const { data: requests = [], isPending, refetch } = useQuery({
    queryKey: ["hr-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/requests");
      return res.data;
    },
  });

  const handleApprove = async (id) => {
    if (!confirm("Approve this request?")) return;
    try {
      await axiosSecure.patch(`/requests/${id}/approve`);
      toast.success("Approved!");
      refetch();
    } catch (err) {
      toast.error("Approval failed",err);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this request?")) return;
    try {
      await axiosSecure.patch(`/requests/${id}/reject`);
      toast.success("Rejected");
      refetch();
    } catch (err) {
      toast.error("Reject failed",err);
    }
  };

  if (isPending) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">All Asset Requests</h1>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          No pending requests
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Note</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <div className="font-bold">{req.requesterName}</div>
                      <div className="text-sm opacity-70">{req.requesterEmail}</div>
                    </div>
                  </td>
                  <td>{req.assetName}</td>
                  <td>
                    <span className={`badge ${req.assetType === "Returnable" ? "badge-success" : "badge-error"}`}>
                      {req.assetType}
                    </span>
                  </td>
                  <td className="max-w-xs truncate">{req.note || "-"}</td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="btn btn-sm btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="btn btn-sm btn-error"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllRequests;