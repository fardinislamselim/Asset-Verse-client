import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import useAuth from "../../../hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const MyEmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const { user: hrUser } = useAuth();

  const {
    data: employees = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["my-employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-employees");
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

  const handleRemove = async (email) => {
    if (
      !window.confirm(
        "Remove this employee from your team? All assets will be returned."
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

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Employee List</h1>
          <p className="text-xl text-gray-600 mt-2">
            <span className="font-bold text-primary">{employees.length}</span> /{" "}
            {currentHr.packageLimit || 5} employees used
          </p>
        </div>
        <div className="text-right">
          <div className="stat bg-base-200 rounded-xl p-4 shadow">
            <div className="stat-title">Package</div>
            <div className="stat-value text-primary">
              {currentHr.subscription || "Basic"}
            </div>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">
            No employees in your team yet.
          </p>
          <p className="text-gray-400 mt-2">
            Employees will appear here after you approve their asset requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((emp) => (
            <div
              key={emp.employeeEmail}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
            >
              <div className="card-body">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={emp.companyLogo || "/default-avatar.jpg"}
                        alt={emp.employeeName}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title">{emp.employeeName}</h2>
                    <p className="text-sm text-gray-600">{emp.employeeEmail}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm">
                    <strong>Joined:</strong>{" "}
                    {new Date(emp.affiliationDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Assigned Assets:</strong> {emp.assignedAssetsCount}
                  </p>
                </div>

                <div className="card-actions mt-6">
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
      )}
    </div>
  );
};

export default MyEmployeeList;
