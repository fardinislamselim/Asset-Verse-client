import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import useAxiosPublic from "../../../hook/useAxiosPublic";

const Packages = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch Packages Section
  const { data: packages = [] } = useQuery({
    queryKey: ["packages-home"],
    queryFn: async () => {
      const res = await axiosPublic.get("/packages");
      return res.data.slice(0, 3);
    },
  });

  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral mb-4">
            Subscription Packages
          </h2>
          <p className="text-gray-500">
            Choose the plan that fits your company size.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.length > 0 ? (
            packages.map((pkg, idx) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative p-8 rounded-3xl bg-base-100 shadow-xl border-2 flex flex-col ${
                  idx === 1
                    ? "border-primary md:scale-105 z-10"
                    : "border-transparent"
                }`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-extrabold text-primary mb-6">
                  ${pkg.price}
                  <span className="text-lg text-gray-400 font-normal">/mo</span>
                </div>
                <p className="text-gray-500 mb-8 border-b pb-8">
                  Up to{" "}
                  <span className="font-bold text-neutral">
                    {pkg.employeeLimit}
                  </span>{" "}
                  Employees
                </p>
                <ul className="space-y-4 mb-8 text-left flex-grow">
                  <li className="flex items-center gap-3 text-gray-600">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />{" "}
                    Real-time Asset Tracking
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />{" "}
                    24/7 Support Access
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />{" "}
                    Detailed Reporting
                  </li>
                </ul>
                <Link
                  to="/hr/upgrade-package"
                  className={`btn w-full rounded-xl ${
                    idx === 1 ? "btn-primary" : "btn-outline"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Packages;
