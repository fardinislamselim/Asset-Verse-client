import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isPending } = useQuery({
    queryKey: ["payment-history"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No payment records found</p>
          <p className="text-gray-400 mt-2">
            Your package upgrades will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-lg">
          <table className="table table-zebra">
            <thead className="bg-base-200 text-base">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Package</th>
                <th className="text-center">Employee Limit</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id} className="hover">
                  <td>{index + 1}</td>

                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>

                  <td>
                    <span className="badge badge-primary badge-lg">
                      {payment.packageName}
                    </span>
                  </td>

                  <td className="text-center font-semibold">
                    {payment.employeeLimit}
                  </td>

                  <td className="font-bold text-lg">${payment.amount}</td>

                  <td className="font-mono text-sm">{payment.transactionId}</td>

                  <td>
                    <span
                      className={`badge badge-lg ${
                        payment.status === "success"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
