import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@global-client-auth";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider clientType="web">
            <App />
        </AuthProvider>
        <Toaster />
    </StrictMode>,
);
