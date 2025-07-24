import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <GoogleOAuthProvider clientId="454139700755-rvcccnqbie60a8cb0kqc1msj7uit7m9a.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AppContextProvider>
  </BrowserRouter>
);
