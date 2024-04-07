import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import React from "react";
import { createRoot } from 'react-dom/client';
import {
  Route,
  MemoryRouter,
  Routes
} from "react-router-dom";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { networkConfig } from "./configs/networkConfig";
import { RootLayout } from "./RootLayout";
import { Environment } from "./components/Environment";
import { GasAddress } from "./components/GasAddress";
import { BuildTestPublish } from "./components/BuildTestPublish";

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
if (root) {
  root.render(<QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <MemoryRouter initialEntries={['/']}>
        <Routes>

          <Route element={<RootLayout />}>
            <Route index element={<App />} />
            <Route path='environment' element={<Environment />} />
            <Route path='gas-address' element={<GasAddress />} />
            <Route path='build-test-publish' element={<BuildTestPublish />} />
          </Route>

        </Routes>
      </MemoryRouter>
    </SuiClientProvider>
  </QueryClientProvider>);
}

// Webpack HMR
// @ts-expect-error
if (import.meta.webpackHot) {
  // @ts-expect-error
  import.meta.webpackHot.accept();
}