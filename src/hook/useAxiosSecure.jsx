import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // Request Interceptor: Add Bearer token
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response Interceptor: Handle unauthorized / forbidden
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            toast.error("Session expired. Please log in again.");
            logOut()
              .then(() => console.log("Logged out successfully."))
              .catch(console.error);
            navigate("/login");
          }
          return Promise.reject(error);
        }
      );

      // Cleanup on unmount or when dependencies change
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
