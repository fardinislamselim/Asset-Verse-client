import React, { useEffect } from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { toast } from "react-hot-toast";

const UpgradePackage = () => {
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Packages & Current User Queries
  const {
    data: packages = [],
    isPending: packagesLoading,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  const {
    data: currentUser = {},
    isPending: userLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user");
      return res.data;
    },
  });

  // Handle return from Stripe
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      confirmUpgrade(sessionId);
    } else if (success === "free") {
      toast.success("Successfully switched to free package!");
      refetchUser(); // Update current user data
    } else if (searchParams.get("canceled") === "true") {
      toast.error("Payment was canceled");
    }

    // Clean URL after handling
    window.history.replaceState({}, "", "/hr/upgrade-package");
  }, [location, searchParams]);

  const confirmUpgrade = async (sessionId) => {
    try {
      await axiosSecure.post("/confirm-payment", { session_id: sessionId });
      toast.success("Payment successful! Your package has been upgraded.");
      refetchUser(); // Refresh user data to show new limit
      refetchPackages(); // Optional: refresh packages if needed
    } catch (err) {
      toast.error("Upgrade failed. Please contact support.");
      console.error(err);
    }
  };

  const handleUpgrade = async (pkg) => {
    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        packageName: pkg.name,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error("Failed to initiate upgrade. Please try again.");
      console.error(err);
    }
  };

  // Loading state
  if (packagesLoading || userLoading) {
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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade Your Package</h1>
        <p className="text-xl text-gray-600 mt-6">
          Current Package:{" "}
          <span className="font-bold text-primary">
            {currentUser.subscription || "Basic"}
          </span>{" "}
          ({currentUser.currentEmployees || 0}/{currentUser.packageLimit || 5}{" "}
          employees used)
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const isCurrent = pkg.name === currentPackage.name;
          const isRecommended = pkg.name === "Standard";

          return (
            <div
              key={pkg._id || pkg.name}
              className={`card bg-base-100 shadow-xl border-2 relative overflow-hidden transition-all ${
                isCurrent ? "border-primary scale-105" : "border-base-300"
              } ${
                isRecommended
                  ? "ring-4 ring-secondary ring-offset-4 ring-offset-base-100"
                  : ""
              }`}
            >
              {isRecommended && (
                <div className="absolute top-0 left-0 right-0 bg-secondary text-secondary-content text-center py-2 font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="card-body text-center pt-12">
                <h2 className="card-title text-3xl justify-center mb-4">
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
                        />
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
                    <button
                      onClick={() => handleUpgrade(pkg)}
                      className="btn btn-primary btn-lg w-full hover:scale-105 transition-shadow"
                    >
                      {pkg.price === 0
                        ? "Switch to Free"
                        : `Upgrade to ${pkg.name} ($${pkg.price}/mo)`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-16">
        <p className="text-gray-500">
          Need more than 20 employees?{" "}
          <a href="mailto:support@assetverse.com" className="link link-primary">
            Contact us
          </a>{" "}
          for Enterprise plan.
        </p>
      </div>
    </div>
  );
};

export default UpgradePackage;
