import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "./routes/Route.tsx";
import ContextProvider from "./provider/ContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./provider/AuthContext.tsx";
import { GlobalNotificationProvider } from "./pages/Dashboards/Patients/GlobalNotificationProvider.tsx";
import GlobalNotificationDisplay from "./pages/Dashboards/Patients/GlobalNotificationDisplay.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContextProvider>
          <GlobalNotificationProvider>
            <RouterProvider router={routes} />
            <GlobalNotificationDisplay /> <Toaster />
          </GlobalNotificationProvider>
        </ContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
