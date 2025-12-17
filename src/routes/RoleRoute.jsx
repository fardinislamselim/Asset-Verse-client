import { Navigate, useLocation } from "react-router";
import useAuth from "../hook/useAuth";
import useRole from "../hook/useRole";

import LoadingSpinner from "../components/LoadingSpinner";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return <LoadingSpinner />;
  }

  if (user && allowedRoles.includes(role)) {
    return children;
  }

  if (user) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RoleRoute;
