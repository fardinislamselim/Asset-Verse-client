import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hook/useAxiosSecure";

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
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto bg-base-100 rounded-xl shadow-lg">
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

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {payments.map((payment) => (
              <div key={payment._id} className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge badge-primary badge-lg">
                      {payment.packageName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold">${payment.amount}</h3>
                     <span
                        className={`badge badge-sm ${
                          payment.status === "success"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {payment.status}
                      </span>
                  </div>

                   <div className="divider my-2"></div>
                   
                   <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                         <span>Employee Limit:</span>
                         <span className="font-semibold">{payment.employeeLimit}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-xs uppercase text-gray-400">Transaction ID</span>
                         <span className="font-mono bg-base-200 p-1 rounded text-xs select-all">
                            {payment.transactionId}
                         </span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
