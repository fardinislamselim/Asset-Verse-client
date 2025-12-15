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

  const { pieData = [], barData = [], summary = {} } = analytics;

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
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.displayName || "HR Manager"}! Here is what's happening today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <FaBoxOpen className="text-4xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Total Assets</div>
          <div className="stat-value text-primary">{summary.totalAssets || 0}</div>
          <div className="stat-desc">In your inventory</div>
        </div>

        {/* Total Employees */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-4xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Total Employees</div>
          <div className="stat-value text-secondary">
            {summary.totalEmployees || 0}
          </div>
          <div className="stat-desc">Active team members</div>
        </div>

        {/* Assigned Assets */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-accent">
            <FaCheckCircle className="text-4xl opacity-80" />
          </div>
          <div className="stat-title font-medium">Assigned Assets</div>
          <div className="stat-value text-accent">
            {summary.assignedAssets || 0}
          </div>
          <div className="stat-desc">Currently in use</div>
        </div>

        {/* Pending Requests */}
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-warning">
            <FaClock className="text-4xl opacity-80" />
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
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
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
                  No data available
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
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrHome;
