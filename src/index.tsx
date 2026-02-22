import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SciChartSurface, SciChart3DSurface } from "scichart";

import App from "./App";
import "./Shared/styles/main.scss";

const rootElement = document.getElementById("root");

SciChartSurface.UseCommunityLicense();
SciChartSurface.configure({ wasmUrl: "/scichart2d.wasm" });
SciChart3DSurface.configure({ wasmUrl: "/scichart3d.wasm" });

const root = createRoot(rootElement!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
