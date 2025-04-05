import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import 'leaflet/dist/leaflet.css';


import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./Context/AppContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <GoogleOAuthProvider clientId="701789501151-qn9v6eco6m7ac0cmlftibegemeunt0j1.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AppContextProvider>
  </BrowserRouter>
);
