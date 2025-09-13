import { Navigate, useLocation } from "react-router";

type userType = {
  email: string;
  role: string;
};

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token") || "";
  const userInfo = localStorage.getItem("userInfo") || "{}";

  let user: userType | null = null;

  try {
    user = JSON.parse(userInfo);
  } catch (error) {
    user = null;
  }

  const isAuthenticated = Boolean(token);
  const userRole = user?.role || "";

  if (!isAuthenticated && !user?.email && !allowedRoles.includes(userRole))
    return <Navigate to={"/login"} state={{ from: location }} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
