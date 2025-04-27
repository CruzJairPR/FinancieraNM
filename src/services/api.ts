import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Interfaces para los tipos de datos
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  subCategory: string;
  assignment: string;
  material: string;
  condition: string;
  daysLeft: number;
  dateInfo: string;
  basePrice: number;
  salePrice: number;
  finalPrice: number;
  margin: string;
  images: string[];
  forChristmas: boolean;
}

export interface AsignacionCategoria {
  name: string;
  cantidad: string;
  rangoMinimo: string;
  rangoMaximo: string;
}

export interface Asignacion {
  id: number;
  fecha: string;
  nombre: string;
  descripcion: string;
  presupuesto: string;
  margen: string;
  categorias: AsignacionCategoria[];
  estado: "sin_asignar" | "en_progreso" | "completada" | "cancelada";
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  avatar: string;
}

export interface Curador {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  experiencia: number;
  proyectos: string[];
  avatar: string;
}

// Instancia de axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    // Almacenar el token y los datos del usuario en localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    // Si no hay token, no está autenticado
    if (!token) {
      return false;
    }

    // Aquí podríamos verificar si el token ha expirado
    // Esto es una versión simplificada, en una implementación real
    // deberíamos decodificar el token JWT y verificar su fecha de expiración
    return true;
  },
  hasRole: (rolRequerido: string) => {
    const user = authService.getCurrentUser();
    return user && user.rol === rolRequerido;
  },
  isAdmin: () => {
    return authService.hasRole("admin");
  },
  isCurador: () => {
    return authService.hasRole("curador");
  },
};

// Servicios para el inventario
export const inventarioService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/inventario");
    return response.data;
  },
  getById: async (id: string): Promise<InventoryItem> => {
    const response = await api.get(`/inventario/${id}`);
    return response.data;
  },
  create: async (data: Omit<InventoryItem, "id">): Promise<InventoryItem> => {
    const response = await api.post("/inventario", data);
    return response.data;
  },
  update: async (
    id: string,
    data: Partial<InventoryItem>
  ): Promise<InventoryItem> => {
    const response = await api.put(`/inventario/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<InventoryItem> => {
    const response = await api.delete(`/inventario/${id}`);
    return response.data;
  },
};

// Servicios para las asignaciones
export const asignacionesService = {
  getAll: async (): Promise<Asignacion[]> => {
    const response = await api.get("/asignaciones");
    return response.data;
  },
  getById: async (id: number): Promise<Asignacion> => {
    const response = await api.get(`/asignaciones/${id}`);
    return response.data;
  },
  create: async (data: Omit<Asignacion, "id">): Promise<Asignacion> => {
    const response = await api.post("/asignaciones", data);
    return response.data;
  },
  update: async (
    id: number,
    data: Partial<Asignacion>
  ): Promise<Asignacion> => {
    const response = await api.put(`/asignaciones/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<Asignacion> => {
    const response = await api.delete(`/asignaciones/${id}`);
    return response.data;
  },
};

// Servicios para usuarios
export const usuariosService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get("/usuarios");
    return response.data;
  },
};

// Servicios para curadores
export const curadoresService = {
  getAll: async (): Promise<Curador[]> => {
    // Datos simulados para pruebas
    const datosCuradores: Curador[] = [
      {
        id: 1,
        nombre: "Ana Gómez",
        especialidad: "Arte Contemporáneo",
        email: "ana.gomez@museo.com",
        telefono: "555-1234",
        experiencia: 8,
        proyectos: ["Exposición Arte Moderno 2023", "Bienal de Arte Urbano"],
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: 2,
        nombre: "Carlos Méndez",
        especialidad: "Arte Clásico",
        email: "carlos.mendez@museo.com",
        telefono: "555-2345",
        experiencia: 12,
        proyectos: ["Retrospectiva Románica", "Exposición del Renacimiento"],
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        id: 3,
        nombre: "Sofía Torres",
        especialidad: "Fotografía",
        email: "sofia.torres@museo.com",
        telefono: "555-3456",
        experiencia: 5,
        proyectos: ["Colección Urbana 2022", "Proyecto Documental"],
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        id: 4,
        nombre: "Martín López",
        especialidad: "Escultura",
        email: "martin.lopez@museo.com",
        telefono: "555-4567",
        experiencia: 10,
        proyectos: ["Instalación Efímera", "Exposición de Metal"],
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ];

    // En lugar de hacer la petición al backend, devolvemos los datos simulados
    // Simulamos la latencia de una petición real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(datosCuradores);
      }, 500);
    });

    // Versión original con petición al backend
    // const response = await api.get("/curadores");
    // return response.data;
  },
  getById: async (id: number): Promise<Curador> => {
    // Datos simulados para pruebas
    const datosCuradores: Curador[] = [
      {
        id: 1,
        nombre: "Ana Gómez",
        especialidad: "Arte Contemporáneo",
        email: "ana.gomez@museo.com",
        telefono: "555-1234",
        experiencia: 8,
        proyectos: ["Exposición Arte Moderno 2023", "Bienal de Arte Urbano"],
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: 2,
        nombre: "Carlos Méndez",
        especialidad: "Arte Clásico",
        email: "carlos.mendez@museo.com",
        telefono: "555-2345",
        experiencia: 12,
        proyectos: ["Retrospectiva Románica", "Exposición del Renacimiento"],
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        id: 3,
        nombre: "Sofía Torres",
        especialidad: "Fotografía",
        email: "sofia.torres@museo.com",
        telefono: "555-3456",
        experiencia: 5,
        proyectos: ["Colección Urbana 2022", "Proyecto Documental"],
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        id: 4,
        nombre: "Martín López",
        especialidad: "Escultura",
        email: "martin.lopez@museo.com",
        telefono: "555-4567",
        experiencia: 10,
        proyectos: ["Instalación Efímera", "Exposición de Metal"],
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ];

    // Simulamos la búsqueda por ID
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const curador = datosCuradores.find((c) => c.id === id);
        if (curador) {
          resolve(curador);
        } else {
          reject(new Error(`No se encontró un curador con id ${id}`));
        }
      }, 500);
    });

    // Versión original con petición al backend
    // const response = await api.get(`/curadores/${id}`);
    // return response.data;
  },
};

export default api;
