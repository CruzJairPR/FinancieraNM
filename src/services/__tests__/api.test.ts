import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { authService } from "../api";

// Mock de axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    // Limpiar mocks entre pruebas
    vi.clearAllMocks();

    // Limpiar localStorage
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("login", () => {
    it("should call the API with correct credentials and store token", async () => {
      // Configurar el mock de axios para devolver una respuesta exitosa
      const mockResponseData = {
        user: { id: 1, nombre: "Test User", rol: "admin" },
        token: "test-jwt-token",
      };

      // @ts-expect-error - Ignorar tipado en test
      axios.create().post.mockResolvedValueOnce({ data: mockResponseData });

      // Llamar al método de login
      const result = await authService.login("test@example.com", "password123");

      // Verificar que se llamó a axios con los parámetros correctos
      expect(axios.create().post).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "password123",
      });

      // Verificar que se guardaron los datos en localStorage
      expect(localStorage.getItem("token")).toBe("test-jwt-token");
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify(mockResponseData.user)
      );

      // Verificar que el resultado es correcto
      expect(result).toEqual(mockResponseData);
    });

    it("should handle login error gracefully", async () => {
      // Configurar el mock de axios para devolver un error
      const mockError = new Error("Invalid credentials");
      // @ts-expect-error - Ignorar tipado en test
      axios.create().post.mockRejectedValueOnce(mockError);

      // Verificar que se lanza el error
      await expect(
        authService.login("test@example.com", "wrong-password")
      ).rejects.toThrow("Invalid credentials");

      // Verificar que no se guardó nada en localStorage
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear localStorage on logout", () => {
      // Configurar localStorage con datos de prueba
      localStorage.setItem("token", "test-jwt-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, nombre: "Test User" })
      );

      // Llamar al método de logout
      authService.logout();

      // Verificar que se limpiaron los datos
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("should return the current user from localStorage", () => {
      const mockUser = { id: 1, nombre: "Test User", rol: "admin" };
      localStorage.setItem("user", JSON.stringify(mockUser));

      const result = authService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("should return null if no user in localStorage", () => {
      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when token exists", () => {
      localStorage.setItem("token", "test-jwt-token");

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it("should return false when token does not exist", () => {
      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("should return true when user has specified role", () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, nombre: "Test User", rol: "admin" })
      );

      const result = authService.hasRole("admin");

      expect(result).toBe(true);
    });

    it("should return false when user does not have specified role", () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, nombre: "Test User", rol: "user" })
      );

      const result = authService.hasRole("admin");

      expect(result).toBe(false);
    });

    it("should return false when no user exists", () => {
      const result = authService.hasRole("admin");

      expect(result).toBe(false);
    });
  });
});
