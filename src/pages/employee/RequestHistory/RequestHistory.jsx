import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/LoadingSpinner";

const RequestHistory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: requests = [], isPending } = useQuery({
    queryKey: ["my-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-requests");
      return res.data;
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "approved":
        return "badge-success";
      case "rejected":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  if (isPending) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">
        My Request History
      </h1>

      {requests.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No requests made yet.</p>
          <p className="text-gray-400 mt-2">
            Your asset requests will appear here after you submit them.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">
          <table className="table table-zebra">
            <thead className="bg-base-200 text-base">
              <tr>
                <th>#</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Note</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id} className="hover">
                  <td>{index + 1}</td>
                  <td className="font-semibold">{req.assetName}</td>
                  <td>
                    <span
                      className={`badge ${
                        req.assetType === "Returnable"
                          ? "badge-success"
                          : "badge-error"
                      } badge-outline`}
                    >
                      {req.assetType}
                    </span>
                  </td>
                  <td>{req.companyName}</td>
                  <td className="max-w-xs truncate">{req.note || "-"}</td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge badge-lg ${getStatusBadge(
                        req.requestStatus
                      )}`}
                    >
                      {req.requestStatus.charAt(0).toUpperCase() +
                        req.requestStatus.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Total Requests</div>
          <div className="stat-value text-primary">{requests.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">
            {requests.filter((r) => r.requestStatus === "pending").length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Approved</div>
          <div className="stat-value text-success">
            {requests.filter((r) => r.requestStatus === "approved").length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-xl shadow">
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">
            {requests.filter((r) => r.requestStatus === "rejected").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;