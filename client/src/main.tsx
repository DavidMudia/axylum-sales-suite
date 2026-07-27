import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>

      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >

        <QueryClientProvider client={queryClient}>

          <AuthProvider>

            <App />

          </AuthProvider>

        </QueryClientProvider>

      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
);