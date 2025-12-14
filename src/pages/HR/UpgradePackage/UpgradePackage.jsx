import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UpgradePackage = () => {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [], isPending } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  const { data: currentUser = {} } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const currentPackage =
    packages.find((p) => p.employeeLimit === currentUser.packageLimit) ||
    packages[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade Your Package</h1>
        <p className="text-xl text-gray-600">
          Current Package:{" "}
          <span className="font-bold text-primary">
            {currentUser.subscription || "Basic"}
          </span>
          ({currentUser.currentEmployees || 0}/{currentUser.packageLimit || 5}{" "}
          employees)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => {
          const isCurrent = pkg.name === currentPackage.name;
          const isRecommended = pkg.name === "Standard";

          return (
            <div
              key={pkg._id || index}
              className={`card bg-base-100 shadow-xl border-2 ${
                isCurrent ? "border-primary" : "border-base-300"
              } ${isRecommended ? "ring-4 ring-secondary ring-offset-4" : ""}`}
            >
              {isRecommended && (
                <div className="badge badge-secondary absolute top-4 right-4">
                  Recommended
                </div>
              )}

              <div className="card-body text-center">
                <h2 className="card-title text-3xl justify-center">
                  {pkg.name}
                </h2>
                <div className="my-6">
                  <span className="text-5xl font-bold">${pkg.price}</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                <p className="text-2xl mb-6">
                  Up to <span className="font-bold">{pkg.employeeLimit}</span>{" "}
                  employees
                </p>

                <ul className="space-y-3 mb-8 text-left">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-success flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="card-actions">
                  {isCurrent ? (
                    <button className="btn btn-primary btn-lg w-full" disabled>
                      Current Package
                    </button>
                  ) : (
                    <button className="btn btn-primary btn-lg w-full hover:scale-105 transition">
                      Upgrade to {pkg.name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500">
          Need more than 20 employees? Contact us for Enterprise plan.
        </p>
      </div>
    </div>
  );
};

export default UpgradePackage;