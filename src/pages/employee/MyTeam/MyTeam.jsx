import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const MyTeam = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedCompany, setSelectedCompany] = useState("all");

  const { data = {}, isPending } = useQuery({
    queryKey: ["my-team"],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-team");
      return res.data;
    },
  });

  const { companies = [], colleagues = [] } = data;

  const filteredColleagues =
    selectedCompany === "all"
      ? colleagues
      : colleagues.filter((c) => c.companyName === selectedCompany);

  const currentMonth = new Date().getMonth();
  const upcomingBirthdays = colleagues.filter((c) => {
    if (!c.dateOfBirth) return false;
    const birthMonth = new Date(c.dateOfBirth).getMonth();
    return birthMonth === currentMonth;
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        My Team
      </h1>

      {companies.length > 0 && (
        <div className="flex justify-center mb-12">
          <div className="tabs tabs-boxed bg-base-200 p-1">
            <a
              className={`tab tab-lg ${selectedCompany === "all" ? "tab-active bg-primary text-primary-content" : ""}`}
              onClick={() => setSelectedCompany("all")}
            >
              All Companies
            </a>
            {companies.map((comp) => (
              <a
                key={comp.hrEmail}
                className={`tab tab-lg ${
                  selectedCompany === comp.companyName ? "tab-active bg-primary text-primary-content" : ""
                }`}
                onClick={() => setSelectedCompany(comp.companyName)}
              >
                {comp.companyName}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        <div className="flex-grow w-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Colleagues
            {selectedCompany !== "all" && (
              <span className="text-gray-500 text-lg font-normal">
                at {selectedCompany}
              </span>
            )}
          </h2>

          {filteredColleagues.length === 0 ? (
            <div className="text-center py-16 bg-base-100 rounded-box border border-dashed border-base-300">
              <p className="text-xl text-gray-500">
                {companies.length === 0
                  ? "You are not affiliated with any company yet."
                  : "No colleagues found in this company."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredColleagues.map((col) => (
                <div
                  key={col.employeeEmail}
                  className="card bg-base-100 border border-base-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body items-center text-center p-6">
                    <div className="avatar mb-3">
                      <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={col.photoURL || col.companyLogo}
                          alt={col.employeeName}
                          onError={(e) => {
                             e.target.src = "https://i.ibb.co/5h1q5Fq/user.png";
                          }}
                        />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{col.employeeName}</h3>
                    <p className="text-xs text-gray-500">{col.companyName}</p>
                    <div className="badge badge-ghost badge-sm mt-2">Team Member</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {upcomingBirthdays.length > 0 && (
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="card bg-gradient-to-br from-base-100 to-base-200 border border-base-200 shadow-xl sticky top-24">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                     <span className="text-2xl">🎂</span>
                  </div>
                  <div>
                    <h2 className="card-title text-lg font-bold">Upcoming Birthdays</h2>
                    <p className="text-xs text-gray-500">Celebrating team members</p>
                  </div>
                </div>
                
                <div className="divider my-2"></div>

                <div className="space-y-4">
                  {upcomingBirthdays.map((emp) => {
                     const isToday = new Date().getDate() === new Date(emp.dateOfBirth).getDate();
                     return (
                    <div
                      key={emp.employeeEmail}
                      className="flex items-center gap-4 p-3 rounded-box bg-base-100 border border-base-200/50 hover:bg-base-200/50 transition-colors"
                    >
                      <div className="avatar">
                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img 
                            src={emp.photoURL || emp.companyLogo} 
                            alt={emp.employeeName} 
                            onError={(e) => {
                                e.target.src = "https://i.ibb.co/5h1q5Fq/user.png";
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{emp.employeeName}</p>
                        <p className="text-xs text-gray-500 truncate">{emp.companyName}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-sm text-primary">
                          {new Date(emp.dateOfBirth).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                         {isToday && <span className="badge badge-xs badge-warning mt-1">Today</span>}
                      </div>
                    </div>
                  )})}
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400 italic">Wish them a happy birthday! 🎉</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeam;
