import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";

const MyEmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const { user: hrUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: response = {},
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["my-employees", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/my-employees?page=${currentPage}&limit=${limit}`
      );
      return res.data; // { employees, pagination }
    },
    keepPreviousData: true,
  });

  const { employees = [], pagination = {} } = response;
  const {
    currentPage: serverPage = 1,
    totalPages = 1,
    totalItems = 0,
    hasNext = false,
    hasPrev = false,
  } = pagination;

  const { data: currentHr = {} } = useQuery({
    queryKey: ["current-hr"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState("");

  const { data: availableAssets = [], refetch: refetchAssets } = useQuery({
    queryKey: ["hr-assets-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/assets?limit=200");
      return res.data.assets.filter((a) => a.availableQuantity > 0);
    },
  });

  const handleAssign = async () => {
    if (!selectedAssetId) return toast.error("Please select an asset");

    try {
      await axiosSecure.post("/assets/direct-assign", {
        assetId: selectedAssetId,
        employeeEmail: selectedEmployee.employeeEmail,
        employeeName: selectedEmployee.employeeName,
      });
      toast.success("Asset assigned successfully");
      setSelectedEmployee(null);
      setSelectedAssetId("");
      refetch();
      refetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign asset");
    }
  };

  const handleRemove = async (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove this employee!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/employee-affiliations/${email}`);
          Swal.fire({
            title: "Removed!",
            text: "Your employee has been removed.",
            icon: "success",
          });
          refetch();
        } catch (err) {
          toast.error("Failed to remove employee", err);
        }
      }
    });
  };

  if (isPending && currentPage === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-bold">My Employee List</h1>
          <p className="text-xl text-gray-600 mt-3">
            <span className="font-bold text-primary">{totalItems}</span> /{" "}
            {currentHr.packageLimit || 5} employees used
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className="stat bg-base-200 rounded-xl p-6 shadow-lg inline-block">
            <div className="stat-title text-lg">Current Package</div>
            <div className="stat-value text-3xl text-primary">
              {currentHr.subscription || "Basic"}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">
          <table className="table table-zebra">
            <thead className="bg-base-200 text-base">
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th className="text-center">Assigned Assets</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    No employees in your team yet.
                  </td>
                </tr>
              ) : (
                employees.map((emp, index) => (
                  <tr key={emp.employeeEmail} className="hover">
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>
                      <div className="font-bold">{emp.employeeName}</div>
                    </td>
                    <td>{emp.employeeEmail}</td>
                    <td>
                      {new Date(emp.affiliationDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-semibold">
                      {emp.assignedAssetsCount}
                    </td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="btn btn-success btn-sm text-white"
                      >
                        Assign Asset
                      </button>
                      <button
                        onClick={() => handleRemove(emp.employeeEmail)}
                        className="btn btn-error btn-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.employeeEmail}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
            >
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-2">
                      <img
                        src={emp.companyLogo || "/default-avatar.jpg"}
                        alt={emp.employeeName}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{emp.employeeName}</h3>
                    <p className="text-sm text-gray-600">{emp.employeeEmail}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
                    <strong>Joined:</strong>{" "}
                    {new Date(emp.affiliationDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Assets:</strong> {emp.assignedAssetsCount}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="btn btn-success btn-outline w-full"
                  >
                    Assign Asset
                  </button>
                  <button
                    onClick={() => handleRemove(emp.employeeEmail)}
                    className="btn btn-error btn-outline w-full"
                  >
                    Remove from Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No employees in your team yet.
          </p>
          <p className="text-gray-400 mt-2">
            Employees will appear here after you approve their asset requests.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
          <div className="join">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={!hasPrev}
              className="join-item btn btn-sm"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className="join-item btn btn-sm"
            >
              ‹ Prev
            </button>

            <button className="join-item btn btn-sm btn-disabled">
              Page {serverPage} / {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNext}
              className="join-item btn btn-sm"
            >
              Next ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={!hasNext}
              className="join-item btn btn-sm"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              Assign Asset to {selectedEmployee.employeeName}
            </h3>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Select Asset</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
              >
                <option value="">-- Choose an Asset --</option>
                {availableAssets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.productName} ({asset.productType}) -{" "}
                    {asset.availableQuantity} available
                  </option>
                ))}
              </select>
              {availableAssets.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    No available assets found.
                  </span>
                </label>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSelectedEmployee(null);
                  setSelectedAssetId("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssign}
                disabled={!selectedAssetId}
              >
                Assign
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyEmployeeList;
