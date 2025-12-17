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
import HighImpactCard from "../../../components/Dashboard/HighImpactCard";
import LoadingSpinner from "../../../components/LoadingSpinner";
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
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome, {user?.displayName || "Employee"}! Here is a summary of your
          assets and requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HighImpactCard
          title="My Assets"
          value={summary.totalAssigned || 0}
          subtitle="Total assigned items"
          icon={FaBoxOpen}
          variant="primary"
          delay={0.1}
        />
        <HighImpactCard
          title="Returnable"
          value={summary.returnable || 0}
          subtitle="Items to be returned"
          icon={FaCheckCircle}
          variant="secondary"
          delay={0.2}
        />
        <HighImpactCard
          title="Non-returnable"
          value={summary.nonReturnable || 0}
          subtitle="Consumables / Permanent"
          icon={FaFileAlt}
          variant="accent"
          delay={0.3}
        />
        <HighImpactCard
          title="Pending Requests"
          value={summary.pending || 0}
          subtitle="Awaiting approval"
          icon={FaExclamationCircle}
          variant="warning"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
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
