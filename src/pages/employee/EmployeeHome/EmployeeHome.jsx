import { useQuery } from "@tanstack/react-query";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaExclamationCircle,
    FaFileAlt,
} from "react-icons/fa";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import useAuth from "../../../hook/useAuth";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const COLORS = ["#36D399", "#3ABFF8", "#FBBD23", "#F87272"];

const EmployeeHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: analytics = {}, isPending } = useQuery({
    queryKey: ["employee-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/employee/analytics");
      return res.data;
    },
  });

  const {
    summary = {},
    pieData = [],
    requestStatusData = [],
    recentAssets = [],
  } = analytics;

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome, {user?.displayName || "Employee"}! Here is a summary of your
          assets and requests.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-primary">
          <div className="stat-figure text-primary">
            <FaBoxOpen className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">My Assets</div>
          <div className="stat-value text-primary">
            {summary.totalAssigned || 0}
          </div>
          <div className="stat-desc">Total assigned items</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-secondary">
          <div className="stat-figure text-secondary">
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Returnable</div>
          <div className="stat-value text-secondary">
            {summary.returnable || 0}
          </div>
          <div className="stat-desc">Items to be returned</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-accent">
          <div className="stat-figure text-accent">
            <FaFileAlt className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Non-returnable</div>
          <div className="stat-value text-accent">
            {summary.nonReturnable || 0}
          </div>
          <div className="stat-desc">Consumables / Permanent</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-warning">
          <div className="stat-figure text-warning">
            <FaExclamationCircle className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Pending Requests</div>
          <div className="stat-value text-warning">{summary.pending || 0}</div>
          <div className="stat-desc">Awaiting approval</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Returnable vs Non-Returnable */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Asset Distribution</h2>
            <div className="h-[300px] w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <p>No assets assigned yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart: Request Status */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Request Status Overview</h2>
            <div className="h-[300px] w-full">
              {requestStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={requestStatusData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                      barSize={50}
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Pending"
                              ? "#FBBD23"
                              : entry.name === "Approved"
                              ? "#36D399"
                              : "#F87272"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <p>No requests made yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assets Section */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Recently Assigned Assets</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Company</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No recently assigned assets found.
                    </td>
                  </tr>
                ) : (
                  recentAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td>
                        <div className="font-bold">{asset.assetName}</div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            asset.assetType === "Returnable"
                              ? "badge-warning badge-outline"
                              : "badge-accent badge-outline"
                          }`}
                        >
                          {asset.assetType}
                        </span>
                      </td>
                      <td>{asset.companyName}</td>
                      <td>
                        {new Date(asset.assignmentDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="badge badge-success text-white">
                          Assigned
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
