import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppStateProvider, useAppState } from "../AppStateContext";
import { authService } from "../../services/api";

// Mock de los servicios de autenticación
vi.mock("../../services/api", () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

// Componente de prueba para acceder al contexto
const TestComponent = () => {
  const {
    appState,
    setAuthStatus,
    setUserRole,
    addNotification,
    logout,
    loginWithCredentials,
  } = useAppState();

  return (
    <div>
      <div data-testid="auth-status">
        {appState.isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      <div data-testid="user-role">{appState.userRole || "no-role"}</div>
      <div data-testid="notifications-count">
        {appState.notifications.length}
      </div>

      <button onClick={() => setAuthStatus(true)}>Set Authenticated</button>
      <button onClick={() => setUserRole("admin")}>Set Admin Role</button>
      <button
        onClick={() =>
          addNotification({
            title: "Test",
            message: "Test Message",
            time: "12:00",
            read: false,
          })
        }
      >
        Add Notification
      </button>
      <button onClick={logout}>Logout</button>
      <button
        onClick={() => loginWithCredentials("test@example.com", "password")}
      >
        Login
      </button>
    </div>
  );
};

describe("AppStateContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock inicial de authService
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.getCurrentUser).mockReturnValue(null);
  });

  const renderWithContext = () => {
    return render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );
  };

  it("should provide initial state correctly", () => {
    renderWithContext();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not-authenticated"
    );
    expect(screen.getByTestId("user-role")).toHaveTextContent("no-role");
    expect(screen.getByTestId("notifications-count")).toHaveTextContent("0");
  });

  it("should update authentication status", async () => {
    renderWithContext();
    const user = userEvent.setup();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not-authenticated"
    );

    await user.click(screen.getByText("Set Authenticated"));

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated"
    );
  });

  it("should update user role", async () => {
    renderWithContext();
    const user = userEvent.setup();

    expect(screen.getByTestId("user-role")).toHaveTextContent("no-role");

    await user.click(screen.getByText("Set Admin Role"));

    expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
  });

  it("should add notifications", async () => {
    renderWithContext();
    const user = userEvent.setup();

    expect(screen.getByTestId("notifications-count")).toHaveTextContent("0");

    await user.click(screen.getByText("Add Notification"));

    expect(screen.getByTestId("notifications-count")).toHaveTextContent("1");
  });

  it("should handle logout correctly", async () => {
    // Configurar un estado inicial autenticado
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockReturnValue({
      id: 1,
      nombre: "Test",
      rol: "admin",
    });

    renderWithContext();
    const user = userEvent.setup();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated"
    );

    await user.click(screen.getByText("Logout"));

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not-authenticated"
    );
    expect(screen.getByTestId("user-role")).toHaveTextContent("no-role");
    expect(authService.logout).toHaveBeenCalled();
  });

  it("should handle login correctly", async () => {
    // Mock del login exitoso
    vi.mocked(authService.login).mockResolvedValue({
      user: { id: 1, nombre: "Test", rol: "admin" },
      token: "test-token",
    });

    renderWithContext();
    const user = userEvent.setup();

    await user.click(screen.getByText("Login"));

    // Esperar a que se procese la promesa
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated"
      );
      expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
    });
  });

  it("should handle login error", async () => {
    // Mock del login fallido
    vi.mocked(authService.login).mockRejectedValue(
      new Error("Invalid credentials")
    );

    renderWithContext();
    const user = userEvent.setup();

    // No deberíamos lanzar el error sino manejarlo en el contexto
    // Para probar esto, usamos act y esperamos a que se resuelva la promesa
    await act(async () => {
      await user.click(screen.getByText("Login"));
    });

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
      // El estado debe seguir sin autenticar
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated"
      );
    });
  });
});
