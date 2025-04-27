import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppState } from "../context/AppStateContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // Opcional: para implementar control por roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { appState } = useAppState();
  const { isAuthenticated, userRole } = appState;

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es necesario
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
