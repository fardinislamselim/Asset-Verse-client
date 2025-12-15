import React, { useState } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

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

  // Filter colleagues by selected company
  const filteredColleagues =
    selectedCompany === "all"
      ? colleagues
      : colleagues.filter((c) => c.companyName === selectedCompany);

  // Upcoming birthdays (current month)
  const currentMonth = new Date().getMonth();
  const upcomingBirthdays = colleagues.filter((c) => {
    if (!c.dateOfBirth) return false;
    const birthMonth = new Date(c.dateOfBirth).getMonth();
    return birthMonth === currentMonth;
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">My Team</h1>

      {/* Company Selector */}
      {companies.length > 0 && (
        <div className="flex justify-center mb-10">
          <div className="tabs tabs-boxed">
            <a
              className={`tab ${selectedCompany === "all" ? "tab-active" : ""}`}
              onClick={() => setSelectedCompany("all")}
            >
              All Companies
            </a>
            {companies.map((comp) => (
              <a
                key={comp.hrEmail}
                className={`tab ${
                  selectedCompany === comp.companyName ? "tab-active" : ""
                }`}
                onClick={() => setSelectedCompany(comp.companyName)}
              >
                {comp.companyName}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🎉 Upcoming Birthdays This Month
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingBirthdays.map((emp) => (
              <div
                key={emp.employeeEmail}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body text-center">
                  <div className="avatar">
                    <div className="w-20 rounded-full mx-auto ring ring-warning ring-offset-2">
                      <img src={emp.companyLogo} alt={emp.employeeName} />
                    </div>
                  </div>
                  <h3 className="font-bold mt-4">{emp.employeeName}</h3>
                  <p className="text-sm text-gray-600">{emp.companyName}</p>
                  <p className="text-warning font-semibold mt-2">
                    {new Date(emp.dateOfBirth).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colleagues List */}
      <h2 className="text-2xl font-bold mb-6">
        Colleagues {selectedCompany !== "all" && `at ${selectedCompany}`}
      </h2>

      {filteredColleagues.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">
            {companies.length === 0
              ? "You are not affiliated with any company yet."
              : "No colleagues in this company."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredColleagues.map((col) => (
            <div
              key={col.employeeEmail}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
            >
              <div className="card-body text-center">
                <div className="avatar">
                  <div className="w-24 rounded-full mx-auto ring ring-primary ring-offset-2">
                    <img src={col.companyLogo} alt={col.employeeName} />
                  </div>
                </div>
                <h3 className="font-bold text-lg mt-4">{col.employeeName}</h3>
                <p className="text-sm text-gray-600">{col.employeeEmail}</p>
                <p className="text-sm mt-2 badge badge-outline">
                  {col.companyName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;
