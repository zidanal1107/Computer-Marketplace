import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { KeranjangProvider } from "./context/KeranjangContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <KeranjangProvider>
            <App />
          </KeranjangProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);