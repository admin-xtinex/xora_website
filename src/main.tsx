import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { EntitlementProvider } from "./billing/EntitlementProvider";
import { Toaster } from "./components/ui/Toast";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <EntitlementProvider>
        <App />
        <Toaster />
      </EntitlementProvider>
    </AuthProvider>
  </StrictMode>,
);
