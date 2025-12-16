import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center p-4">
      <div className="max-w-md space-y-6">
        <h1 className="text-9xl font-extrabold text-primary">Oops!</h1>
        <h2 className="text-3xl font-bold text-neutral">
          Unexpected Error Occurred
        </h2>
        <p className="text-lg text-neutral-content">
          {error?.statusText || error?.message || "Something went wrong."}
        </p>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-4 text-left">
             <code className="text-xs text-error break-words">
               {error?.stack || "No stack trace available"}
             </code>
          </div>
        </div>

        <Link to="/" className="btn btn-primary btn-wide rounded-full shadow-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
