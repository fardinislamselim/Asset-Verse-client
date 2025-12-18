import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaExclamationTriangle, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: requests = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["hr-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/requests");
      return res.data;
    },
  });

  const { data: currentHr = {} } = useQuery({
    queryKey: ["current-hr"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  useEffect(() => {}, [
    isPending,
    requests.length,
    currentHr.packageLimit,
    navigate,
  ]);

const handleApprove = async (id) => {
  try {
    const response = await axiosSecure.patch(`/requests/${id}/approve`);
    // Success handling...
    refetch();
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to approve";
    const action = err.response?.data?.action;

    if (action === "upgrade_required") {
      // Prompt upgrade and navigate
      Swal.fire({
        title: "Employee Limit Reached",
        text: errorMessage,
        icon: "warning",
        confirmButtonText: "Upgrade Package",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/hr/upgrade-package"); // Redirect to your payment/upgrade page
        }
      });
    } else {
      // General error
      toast.error(errorMessage);
    }
  }
};

  const handleReject = async (id) => {
    Swal.fire({
      title: "Reject Asset Request?",
      text: "This action will permanently reject the employee’s asset request. You cannot undo this once confirmed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject Request",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/requests/${id}/reject`);

          Swal.fire({
            title: "Request Rejected",
            text: "The asset request has been successfully rejected.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          refetch();
        } catch (err) {
          toast.error("Failed to reject the request. Please try again.", err);
        }
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <h1 className="text-4xl font-bold">All Asset Requests</h1>
        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-title text-black font-semibold">Team Capacity</div>
            <div className={`stat-value transition-colors duration-500 ${currentHr.currentEmployees >= currentHr.packageLimit ? 'text-error' : 'text-primary'}`}>
              {currentHr.currentEmployees || 0} / {currentHr.packageLimit || 5}
            </div>
            <div className="stat-desc font-medium">Used Slots</div>
          </div>
        </div>
      </div>

      {currentHr.currentEmployees >= currentHr.packageLimit && requests.some(r => !r.isAffiliated) && (
        <div className="alert alert-warning shadow-lg mb-8 border-2 animate-pulse">
          <FaExclamationTriangle className="text-2xl" />
          <div>
            <h3 className="font-bold">New Employee Requests Found!</h3>
            <div className="text-xs">You have reached your team limit. Approving requests from non-team members will require a package upgrade.</div>
          </div>
          <button 
            onClick={() => navigate("/hr/upgrade-package")}
            className="btn btn-sm btn-primary"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-20 text-xl text-gray-500">
          No pending requests
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto bg-base-100 rounded-xl shadow-lg">
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
                        <div className="font-bold flex items-center gap-2">
                          {req.requesterName}
                          {req.isAffiliated ? (
                            <span className="badge badge-success badge-xs gap-1 py-2 px-2 text-[10px] font-bold">
                              <FaCheckCircle className="text-[10px]" /> TEAM
                            </span>
                          ) : (
                            <span className="badge badge-warning badge-xs gap-1 py-2 px-2 text-[10px] font-bold">
                              <FaUserPlus className="text-[10px]" /> NEW
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-70">
                          {req.requesterEmail}
                        </div>
                      </div>
                    </td>
                    <td>{req.assetName}</td>
                    <td>
                      <span
                        className={`badge ${
                          req.assetType === "Returnable"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {req.assetType}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">{req.note || "-"}</td>
                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleApprove(req._id)}
                        disabled={!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5)}
                        className={`btn btn-sm ${!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5) ? 'btn-disabled opacity-50' : 'btn-success'}`}
                        title={!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5) ? "Upgrade package to add new employees" : ""}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {requests.map((req) => (
              <div
                key={req._id}
                className="card bg-base-100 shadow-lg border border-base-200"
              >
                <div className="card-body p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{req.requesterName}</h3>
                      <p className="text-xs text-gray-500">
                        {req.requesterEmail}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`badge ${
                          req.assetType === "Returnable"
                            ? "badge-success"
                            : "badge-error"
                        } badge-sm`}
                      >
                        {req.assetType}
                      </span>
                      {req.isAffiliated ? (
                        <span className="badge badge-success badge-sm border-none bg-success/20 text-success font-bold">
                          TEAM
                        </span>
                      ) : (
                        <span className="badge badge-warning badge-sm border-none bg-warning/20 text-warning font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm space-y-2 mb-4">
                    <p>
                      <span className="font-semibold">Asset:</span>{" "}
                      {req.assetName}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(req.requestDate).toLocaleDateString()}
                    </p>
                    <p className="bg-base-200 p-2 rounded text-gray-600 text-xs italic">
                      "{req.note || "No note provided"}"
                    </p>
                  </div>

                  <div className="card-actions justify-end grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5)}
                      className={`btn btn-sm w-full ${!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5) ? 'btn-disabled opacity-50 text-gray-400' : 'btn-success'}`}
                      title={!req.isAffiliated && (currentHr.currentEmployees || 0) >= (currentHr.packageLimit || 5) ? "Upgrade package to add new employees" : ""}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="btn btn-error btn-sm w-full"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllRequests;
