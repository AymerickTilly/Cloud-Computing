import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../auth/AuthStore';

const AuthenticationRoutes = () => {
  const { user, loading, pendingUsername } = useAuthStore();

  if (loading) {
    console.log(user)
    console.log(pendingUsername)
    console.log("Here 1st if")
    return <div>Loading...</div>; // Optional loading UI
  }

  // Redirect if user is logged in or in registration process
  if (user || pendingUsername) {
    console.log(user)
    console.log(pendingUsername)
    console.log("Here 2nd if")
    return <Navigate to="/" replace />;
  }

  // Allow access to /login or /register
  console.log(user)
  console.log(pendingUsername)
  console.log("Here end")
  return <Outlet />;
};

export default AuthenticationRoutes;

