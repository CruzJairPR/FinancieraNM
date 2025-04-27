import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CrearAsignacion from "../pages/CrearAsignacion";
import PartidasBuscar from "../pages/PartidasBuscar";
import PartidaCategorias from "../pages/PartidaCategorias";
import AsignarCurador from "../pages/AsignarCurador";
import ProtectedRoute from "../components/ProtectedRoute";
import Inventario from "../pages/Inventario";
import Curadores from "../pages/Curadores";
import VisitasAgendadas from "../pages/VisitasAgendadas/VisitasAgendadas";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crear-asignacion"
        element={
          <ProtectedRoute>
            <CrearAsignacion />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partidas-buscar"
        element={
          <ProtectedRoute>
            <PartidasBuscar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partidas-categorias"
        element={
          <ProtectedRoute>
            <PartidaCategorias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asignar-curador"
        element={
          <ProtectedRoute>
            <AsignarCurador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario"
        element={
          <ProtectedRoute>
            <Inventario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/curadores"
        element={
          <ProtectedRoute>
            <Curadores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitas-agendadas"
        element={
          <ProtectedRoute>
            <VisitasAgendadas />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
