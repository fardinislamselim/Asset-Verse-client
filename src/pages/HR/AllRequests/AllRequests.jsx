import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";

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
  if (currentHr.currentEmployees >= currentHr.packageLimit) {
    Swal.fire({
      title: "Employee Limit Reached",
      text: "Your current package does not allow adding more employees. Please upgrade your package.",
      icon: "warning",
      confirmButtonText: "Upgrade Package",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/hr/upgrade-package");
      }
    });
  } else {
    Swal.fire({
      title: "Approve Asset Request?",
      text: "This employee will be assigned the requested asset.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/requests/${id}/approve`);

          Swal.fire({
            title: "Approved!",
            text: "The asset request has been approved successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          refetch();
        } catch (err) {
          toast.error("Failed to approve the request");
        }
      }
    });
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
      <h1 className="text-4xl font-bold mb-8">All Asset Requests</h1>

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
                        <div className="font-bold">{req.requesterName}</div>
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
                    <span
                      className={`badge ${
                        req.assetType === "Returnable"
                          ? "badge-success"
                          : "badge-error"
                      } badge-sm`}
                    >
                      {req.assetType}
                    </span>
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
                      className="btn btn-success btn-sm w-full"
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
