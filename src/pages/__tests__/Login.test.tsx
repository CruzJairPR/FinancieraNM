import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";

// Mock de los hooks y context
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../context/AppStateContext", () => ({
  useAppState: () => ({
    appState: { isAuthenticated: false },
    loginWithCredentials: vi.fn().mockResolvedValue({
      success: true,
      user: { nombre: "Test User", rol: "admin" },
    }),
    addNotification: vi.fn(),
  }),
}));

// Mock de ReCAPTCHA
vi.mock("react-google-recaptcha", () => ({
  default: vi.fn().mockImplementation(({ onChange }) => {
    // Simulamos que el captcha ha sido verificado
    setTimeout(() => onChange("test-token"), 0);
    return <div data-testid="recaptcha-mock">ReCAPTCHA</div>;
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("renders the login form correctly", () => {
    renderLogin();

    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ingresar/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/¿olvidaste tu contraseña\?/i)).toBeInTheDocument();
    expect(screen.getByTestId("recaptcha-mock")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderLogin();
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /ingresar/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/correo electrónico es requerido/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/contraseña es requerida/i)
    ).toBeInTheDocument();
  });

  it("shows error for invalid email format", async () => {
    renderLogin();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /ingresar/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/formato del correo electrónico es inválido/i)
    ).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    renderLogin();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    const submitButton = screen.getByRole("button", { name: /ingresar/i });
    await user.click(submitButton);

    // Esperamos a que se procese todo
    await waitFor(() => {
      expect(
        screen.queryByText(/correo electrónico es requerido/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/contraseña es requerida/i)
      ).not.toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    renderLogin();
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const visibilityButton = screen.getByLabelText(
      /toggle password visibility/i
    );
    await user.click(visibilityButton);

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(visibilityButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
