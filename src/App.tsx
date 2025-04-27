import React from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { AsignacionProvider } from "./context/AsignacionContext";
import { AppThemeProvider } from "./theme/AppThemeProvider";
import { AppStateProvider } from "./context/AppStateContext";

function App() {
  return (
    <AppThemeProvider>
      <AppStateProvider>
        <AsignacionProvider>
          <AppRoutes />
        </AsignacionProvider>
      </AppStateProvider>
    </AppThemeProvider>
  );
}

export default App;
