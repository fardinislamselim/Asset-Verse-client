import { useQuery } from "@tanstack/react-query";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaUsers
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
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.displayName || "HR Manager"}! Here is your team's
          overview.
        </p>
      </div>

      {(summary.currentEmployees || summary.totalEmployees) >= (summary.packageLimit || 5) && recentRequests.some(r => r.requestStatus === "pending" && !r.isAffiliated) && (
        <div className="alert alert-warning shadow-lg border-2 animate-pulse">
          <FaExclamationTriangle className="text-2xl" />
          <div>
            <h3 className="font-bold">Team Limit Warning!</h3>
            <div className="text-xs">You are at your employee limit. Approving requests from new employees will require an upgrade.</div>
          </div>
          <button 
            onClick={() => window.location.href = "/hr/upgrade-package"}
            className="btn btn-sm btn-primary"
          >
            Upgrade Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HighImpactCard
          title="Total Assets"
          value={summary.totalAssets || 0}
          subtitle="In your inventory"
          icon={FaBoxOpen}
          variant="primary"
          delay={0.1}
        />
        <HighImpactCard
          title="Total Employees"
          value={summary.totalEmployees || 0}
          subtitle="Active team members"
          icon={FaUsers}
          variant="secondary"
          delay={0.2}
        />
        <HighImpactCard
          title="Assigned Assets"
          value={summary.assignedAssets || 0}
          subtitle="Currently in use"
          icon={FaCheckCircle}
          variant="accent"
          delay={0.3}
        />
        <HighImpactCard
          title="Pending Requests"
          value={summary.pendingRequests || 0}
          subtitle="Awaiting approval"
          icon={FaClock}
          variant="warning"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
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

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-xl">Recent Requests</h2>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          
          <>
            
            <div className="hidden lg:block overflow-x-auto">
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
                            <div className="font-bold flex items-center gap-2">
                              {req.requesterName}
                              {req.isAffiliated ? (
                                <span className="badge badge-success badge-xs gap-1 py-1 px-2 text-[8px] font-bold">
                                  TEAM
                                </span>
                              ) : (
                                <span className="badge badge-warning badge-xs gap-1 py-1 px-2 text-[8px] font-bold">
                                  NEW
                                </span>
                              )}
                            </div>
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

            <div className="lg:hidden flex flex-col gap-4">
               {recentRequests.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    No recent requests found.
                  </p>
                ) : (
                  recentRequests.map((req) => (
                    <div key={req._id} className="card bg-base-100 border border-base-200 shadow-sm p-4">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <h4 className="font-bold">{req.assetName}</h4>
                             <p className="text-xs text-gray-500">{req.assetType}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`badge ${
                                req.requestStatus === "pending"
                                  ? "badge-warning"
                                  : req.requestStatus === "approved"
                                  ? "badge-success text-white"
                                  : "badge-error text-white"
                              } badge-sm`}
                            >
                              {req.requestStatus}
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
                       
                       <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                             <div className="bg-neutral text-neutral-content rounded-full w-8">
                                <span className="text-xs">{req.requesterName.charAt(0)}</span>
                             </div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-semibold truncate">{req.requesterName}</p>
                             <p className="text-xs text-gray-400 truncate">{req.requesterEmail}</p>
                          </div>
                          <p className="text-xs text-gray-400">
                             {new Date(req.requestDate).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                  ))
                )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default HrHome;
