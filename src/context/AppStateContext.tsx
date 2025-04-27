import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { authService } from "../services/api";
import { Usuario } from "../services/api";

interface AppState {
  isAuthenticated: boolean;
  userRole: string | null;
  notifications: Notification[];
  user: Usuario | null;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppStateContextType {
  appState: AppState;
  setAuthStatus: (status: boolean) => void;
  setUserRole: (role: string | null) => void;
  setUser: (user: Usuario | null) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  logout: () => void;
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: Usuario;
    error?: string;
  }>;
}

// Inicializamos basado en si hay un token JWT válido
const initialState: AppState = {
  isAuthenticated: authService.isAuthenticated(),
  userRole: authService.getCurrentUser()?.rol || null,
  notifications: [],
  user: authService.getCurrentUser(),
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppState>(initialState);

  // Efecto para verificar la autenticación cuando el componente se monta
  useEffect(() => {
    const checkAuthentication = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();

      setAppState((prevState) => ({
        ...prevState,
        isAuthenticated: isAuth,
        userRole: user?.rol || null,
        user: user,
      }));
    };

    checkAuthentication();
  }, []);

  const setAuthStatus = (status: boolean) => {
    setAppState((prev) => ({ ...prev, isAuthenticated: status }));
  };

  const setUserRole = (role: string | null) => {
    setAppState((prev) => ({ ...prev, userRole: role }));
  };

  const setUser = (user: Usuario | null) => {
    setAppState((prev) => ({ ...prev, user }));
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
    };
    setAppState((prev) => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
    }));
  };

  const markNotificationAsRead = (id: number) => {
    setAppState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    }));
  };

  const markAllNotificationsAsRead = () => {
    setAppState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const user = response.user;

      setAppState((prev) => ({
        ...prev,
        isAuthenticated: true,
        userRole: user.rol,
        user,
      }));

      return { success: true, user };
    } catch (error: unknown) {
      console.error("Error de inicio de sesión:", error);
      // Manejar el tipo error de manera segura
      let errorMessage = "Error al iniciar sesión";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string } };
        };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    authService.logout();
    setAppState({
      isAuthenticated: false,
      userRole: null,
      notifications: [],
      user: null,
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        appState,
        setAuthStatus,
        setUserRole,
        setUser,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logout,
        loginWithCredentials,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState debe ser usado dentro de un AppStateProvider");
  }
  return context;
};
