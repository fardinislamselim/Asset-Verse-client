import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isPending: isRoleLoading } = useQuery({
    queryKey: [user?.email, "role"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get("/user");
      return data.role;
    },
  });

  return [role, isRoleLoading];
};

export default useRole;
