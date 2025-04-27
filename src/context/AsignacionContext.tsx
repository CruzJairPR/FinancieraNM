import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {
  asignacionesService,
  Asignacion,
  AsignacionCategoria,
} from "../services/api";

// Interfaces para los tipos de datos
export interface FormData {
  nombre: string;
  fecha: string;
  descripcion: string;
  presupuesto: string;
  margen: string;
}

export type { Asignacion, AsignacionCategoria };

interface AsignacionContextType {
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedCategories: AsignacionCategoria[];
  setSelectedCategories: (categories: AsignacionCategoria[]) => void;
  selectedCheckboxes: { [key: string]: boolean };
  setSelectedCheckboxes: (checkboxes: { [key: string]: boolean }) => void;
  asignaciones: Asignacion[];
  loading: boolean;
  error: string | null;
  saveAsignacion: (asignacion: Omit<Asignacion, "id">) => Promise<void>;
  updateAsignacion: (
    id: number,
    asignacion: Partial<Asignacion>
  ) => Promise<void>;
  deleteAsignacion: (id: number) => Promise<void>;
  resetFormData: () => void;
}

const defaultFormData: FormData = {
  nombre: "",
  fecha: "",
  descripcion: "",
  presupuesto: "",
  margen: "",
};

const AsignacionContext = createContext<AsignacionContextType | undefined>(
  undefined
);

export const AsignacionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [selectedCategories, setSelectedCategories] = useState<
    AsignacionCategoria[]
  >([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<{
    [key: string]: boolean;
  }>({});
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar asignaciones al montar el componente
  useEffect(() => {
    const fetchAsignaciones = async () => {
      setLoading(true);
      try {
        const data = await asignacionesService.getAll();
        setAsignaciones(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar asignaciones:", err);
        setError("No se pudieron cargar las asignaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaciones();
  }, []);

  const saveAsignacion = useCallback(
    async (asignacion: Omit<Asignacion, "id">) => {
      setLoading(true);
      try {
        const savedAsignacion = await asignacionesService.create(asignacion);
        setAsignaciones((prev) => [...prev, savedAsignacion]);
        setError(null);
      } catch (err) {
        console.error("Error al guardar asignación:", err);
        setError("No se pudo guardar la asignación");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAsignacion = useCallback(
    async (id: number, data: Partial<Asignacion>) => {
      setLoading(true);
      try {
        const updatedAsignacion = await asignacionesService.update(id, data);
        setAsignaciones((prev) =>
          prev.map((asignacion) =>
            asignacion.id === id ? updatedAsignacion : asignacion
          )
        );
        setError(null);
      } catch (err) {
        console.error("Error al actualizar asignación:", err);
        setError("No se pudo actualizar la asignación");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAsignacion = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await asignacionesService.delete(id);
      setAsignaciones((prev) =>
        prev.filter((asignacion) => asignacion.id !== id)
      );
      setError(null);
    } catch (err) {
      console.error("Error al eliminar asignación:", err);
      setError("No se pudo eliminar la asignación");
    } finally {
      setLoading(false);
    }
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(defaultFormData);
    setSelectedCategories([]);
    setSelectedCheckboxes({});
  }, []);

  return (
    <AsignacionContext.Provider
      value={{
        formData,
        setFormData,
        selectedCategories,
        setSelectedCategories,
        selectedCheckboxes,
        setSelectedCheckboxes,
        asignaciones,
        loading,
        error,
        saveAsignacion,
        updateAsignacion,
        deleteAsignacion,
        resetFormData,
      }}
    >
      {children}
    </AsignacionContext.Provider>
  );
};

export const useAsignacion = () => {
  const context = useContext(AsignacionContext);
  if (context === undefined) {
    throw new Error(
      "useAsignacion debe ser usado dentro de un AsignacionProvider"
    );
  }
  return context;
};
