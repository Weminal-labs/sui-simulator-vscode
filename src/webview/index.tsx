import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import React from "react";
import { createRoot } from 'react-dom/client';
import { SuiClientProvider } from "@mysten/dapp-kit";
import { networkConfig } from "./configs/networkConfig";

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"))
if (root) {
  root.render(<QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <App />
    </SuiClientProvider>
  </QueryClientProvider>);
}

// Webpack HMR
// @ts-expect-error
if (import.meta.webpackHot) {
  // @ts-expect-error
  import.meta.webpackHot.accept()
}