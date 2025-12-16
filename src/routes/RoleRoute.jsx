import { Navigate, useLocation } from "react-router";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (user && allowedRoles.includes(role)) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RoleRoute;
