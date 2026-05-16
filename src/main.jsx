import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "@fontsource-variable/onest";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "Onest Variable, sans-serif",
            borderRadius: "12px",
            background: "#1C1B19",
            color: "#FFFFFF",
          },
          success: {
            iconTheme: {
              primary: "#F95E08",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
