import { useQuery } from "@tanstack/react-query";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaUsers,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const HrHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: analytics = {}, isPending } = useQuery({
    queryKey: ["hr-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/analytics");
      return res.data;
    },
  });

  const {
    pieData = [],
    barData = [],
    summary = {},
    recentRequests = [],
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
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.displayName || "HR Manager"}! Here is your team's
          overview.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-primary">
          <div className="stat-figure text-primary">
            <FaBoxOpen className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Total Assets</div>
          <div className="stat-value text-primary">{summary.totalAssets || 0}</div>
          <div className="stat-desc">In your inventory</div>
        </div>

        {/* Total Employees */}
        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-secondary">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Total Employees</div>
          <div className="stat-value text-secondary">
            {summary.totalEmployees || 0}
          </div>
          <div className="stat-desc">Active team members</div>
        </div>

        {/* Assigned Assets */}
        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-accent">
          <div className="stat-figure text-accent">
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Assigned Assets</div>
          <div className="stat-value text-accent">
            {summary.assignedAssets || 0}
          </div>
          <div className="stat-desc">Currently in use</div>
        </div>

        {/* Pending Requests */}
        <div className="stat bg-base-100 shadow-lg rounded-2xl border-l-4 border-warning">
          <div className="stat-figure text-warning">
            <FaClock className="text-3xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Pending Requests</div>
          <div className="stat-value text-warning">
            {summary.pendingRequests || 0}
          </div>
          <div className="stat-desc">Awaiting approval</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-6">Asset Distribution</h2>
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
                  No assets to show distribution
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-6">Top Requested Assets</h2>
            <div className="h-[300px] w-full">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="requests"
                      fill="#8884d8"
                      name="Requests"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No requests to show
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl">Recent Requests</h2>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Requestor</th>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No recent requests found.
                    </td>
                  </tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <div>
                          <div className="font-bold">{req.requesterName}</div>
                          <div className="text-xs opacity-50">{req.requesterEmail}</div>
                        </div>
                      </td>
                      <td>{req.assetName}</td>
                      <td>{req.assetType}</td>
                      <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.requestStatus === "pending"
                              ? "badge-warning"
                              : req.requestStatus === "approved"
                              ? "badge-success text-white"
                              : "badge-error text-white"
                          }`}
                        >
                          {req.requestStatus}
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

export default HrHome;
