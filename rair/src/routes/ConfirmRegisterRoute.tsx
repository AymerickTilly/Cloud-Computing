import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../auth/AuthStore";

const ConfirmRegisterRoute= () => {
  const { pendingUsername } = useAuthStore();
  return pendingUsername ? <Outlet /> : <Navigate to="/register" replace />;
};

export default ConfirmRegisterRoute;