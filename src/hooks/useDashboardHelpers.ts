import { useMemo } from "react";
import { useAsignacion, Asignacion } from "../context/AsignacionContext";

export const useDashboardHelpers = () => {
  const { asignaciones } = useAsignacion();

  // Formatea una fecha a un formato legible
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Crea resúmenes estadísticos de las asignaciones
  const getAsignacionesStats = useMemo(() => {
    const totalAsignaciones = asignaciones.length;
    const sinAsignar = asignaciones.filter(
      (a) => a.estado === "sin_asignar"
    ).length;
    const enProgreso = asignaciones.filter(
      (a) => a.estado === "en_progreso"
    ).length;
    const completadas = asignaciones.filter(
      (a) => a.estado === "completada"
    ).length;
    const canceladas = asignaciones.filter(
      (a) => a.estado === "cancelada"
    ).length;

    return {
      totalAsignaciones,
      sinAsignar,
      enProgreso,
      completadas,
      canceladas,
    };
  }, [asignaciones]);

  // Filtra asignaciones por fecha
  const filterByDateRange = (
    startDate: Date | null,
    endDate: Date | null
  ): Asignacion[] => {
    if (!startDate && !endDate) return asignaciones;

    return asignaciones.filter((asignacion) => {
      const asignacionDate = new Date(asignacion.fecha);
      if (startDate && endDate) {
        return asignacionDate >= startDate && asignacionDate <= endDate;
      } else if (startDate) {
        return asignacionDate >= startDate;
      } else if (endDate) {
        return asignacionDate <= endDate;
      }
      return true;
    });
  };

  // Ordena asignaciones por fecha
  const sortAsignaciones = (
    asignacionesList: Asignacion[],
    order: "asc" | "desc" = "desc"
  ): Asignacion[] => {
    return [...asignacionesList].sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  return {
    formatDate,
    getAsignacionesStats,
    filterByDateRange,
    sortAsignaciones,
  };
};
