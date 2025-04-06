import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Stopwatch from "./Stopwatch.tsx";

createRoot(document.getElementById("content")!).render(
  <StrictMode>
    <Stopwatch />
  </StrictMode>
);
