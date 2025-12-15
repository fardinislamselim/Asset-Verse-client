import React, { useState } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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

  const handleRemove = async (email) => {
    if (
      !window.confirm(
        "Remove this employee from your team? All assigned assets will be returned."
      )
    )
      return;

    try {
      await axiosSecure.delete(`/employee-affiliations/${email}`);
      toast.success("Employee removed from team");
      refetch();
    } catch (err) {
      toast.error("Failed to remove employee");
    }
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
      {/* Header */}
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

      {/* Desktop Table / Mobile Cards */}
      <div className="hidden lg:block">
        {/* Desktop Table */}
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
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 rounded-full ring ring-primary ring-offset-2">
                            <img
                              src={emp.companyLogo || "/default-avatar.jpg"}
                              alt={emp.employeeName}
                            />
                          </div>
                        </div>
                        <div className="font-bold">{emp.employeeName}</div>
                      </div>
                    </td>
                    <td>{emp.employeeEmail}</td>
                    <td>
                      {new Date(emp.affiliationDate).toLocaleDateString()}
                    </td>
                    <td className="text-center font-semibold">
                      {emp.assignedAssetsCount}
                    </td>
                    <td>
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

      {/* Mobile Cards */}
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

                <button
                  onClick={() => handleRemove(emp.employeeEmail)}
                  className="btn btn-error btn-outline mt-4 w-full"
                >
                  Remove from Team
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State (Mobile) */}
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

      {/* Pagination */}
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
    </div>
  );
};

export default MyEmployeeList;