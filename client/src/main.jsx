import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Import } from "lucide-react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        locale="en"
      >
        <App />
      </GoogleOAuthProvider>
    </AppContextProvider>
  </BrowserRouter>
);
