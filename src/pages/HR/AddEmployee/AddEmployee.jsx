import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaExclamationTriangle, FaUserFriends, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const AddEmployee = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees-to-add"],
    queryFn: async () => {
      const res = await axiosSecure.get("/employees-to-add");
      return res.data;
    },
  });

  const { data: hrData = {} } = useQuery({
    queryKey: ["current-hr-info"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (emp) => {
      const res = await axiosSecure.post("/add-to-team", {
        employeeEmail: emp.email,
        employeeName: emp.name,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Employee added to team! ✅");
      queryClient.invalidateQueries({ queryKey: ["employees-to-add"] });
      queryClient.invalidateQueries({ queryKey: ["my-employees"] });
      queryClient.invalidateQueries({ queryKey: ["current-hr-info"] });
    },
    onError: (err) => {
      if (err.response?.data?.action === "upgrade_required") {
        toast.error("Employee limit reached! Please upgrade your package.");
        navigate("/hr/upgrade-package");
      } else {
        toast.error(err.response?.data?.message || "Failed to add employee");
      }
    },
  });

  const handleAdd = (emp) => {
    addMutation.mutate(emp);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const limitReached = hrData.currentEmployees >= hrData.packageLimit;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-base-200 p-8 rounded-2xl shadow-lg border border-base-300">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FaUserFriends className="text-primary" /> Add New Employee
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Find and add employees to your company team.
          </p>
        </div>
        <div className="text-center md:text-right">
          <div className={`stat rounded-xl p-4 shadow-inner border ${limitReached ? 'bg-error/10 border-error' : 'bg-success/10 border-success'}`}>
            <div className="stat-title text-sm font-bold uppercase tracking-wider">Team Capacity</div>
            <div className={`stat-value text-3xl ${limitReached ? 'text-error' : 'text-success'}`}>
              {hrData.currentEmployees || 0} / {hrData.packageLimit || 5}
            </div>
            <div className="stat-desc mt-1 font-medium">
              {limitReached ? "Limit reached! Upgrade needed." : "Space available"}
            </div>
          </div>
        </div>
      </div>

      {limitReached && (
        <div className="alert alert-warning shadow-lg mb-8 border-2">
          <FaExclamationTriangle className="text-2xl" />
          <div>
            <h3 className="font-bold">Team Limit Reached!</h3>
            <div className="text-xs">You have already reached the maximum employee limit for your package.</div>
          </div>
          <button 
            onClick={() => navigate("/hr/upgrade-package")}
            className="btn btn-sm btn-primary"
          >
            Upgrade Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
            <p className="text-2xl text-gray-400 font-medium italic">No available employees found.</p>
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp.email} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
                      {emp.photoURL ? (
                        <img src={emp.photoURL} alt={emp.name} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-2xl font-bold text-primary italic">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title text-xl font-bold">{emp.name}</h2>
                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{emp.email}</p>
                  </div>
                </div>
                
                <div className="card-actions mt-4">
                  <button
                    onClick={() => handleAdd(emp)}
                    disabled={limitReached || addMutation.isPending}
                    className={`btn w-full gap-2 ${limitReached ? 'btn-disabled' : 'btn-primary'}`}
                  >
                    {addMutation.isPending ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <FaUserPlus />
                    )}
                    Add to Team
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddEmployee;
