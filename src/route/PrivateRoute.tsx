import { Navigate } from "react-router-dom";
import { PrivateRouteProps } from "../types/RouteTypes";
import React from "react";
import { isUserAuthenticated } from "../helpers/tokens";

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = isUserAuthenticated();

  if (!isAuthenticated) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
