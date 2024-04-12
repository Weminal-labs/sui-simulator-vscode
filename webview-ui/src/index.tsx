import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import { Route, MemoryRouter, Routes } from "react-router-dom";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { networkConfig } from "./configs/networkConfig";
import { RootLayout } from "./RootLayout";
import { SuiEnv } from "./features/suiEnv";
import { GasAddress } from "./features/gasAddress/";
import { BuildTestPublish } from "./features/buildTestPublish";
import { MySuiEnvProvider } from "./context/MySuiEnvProvider";
import { MySuiAccountProvider } from "./context/MySuiAccountProvider";
import { PackageExplorer } from "./features/packageExplorer/index";
import { MySuiAliasProvider } from "./context/MySuiAliasProvider";

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
if (root) {
  root.render(
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <MySuiEnvProvider>
          <MySuiAccountProvider>
            <MySuiAliasProvider>
              <MemoryRouter initialEntries={["/"]}>
                <Routes>
                  <Route element={<RootLayout />}>
                    <Route index element={<App />} />
                    <Route path="environment" element={<SuiEnv />} />
                    <Route path="gas-address" element={<GasAddress />} />
                    <Route path="build-test-publish" element={<BuildTestPublish />} />
                    <Route path="explorer" element={<PackageExplorer />} />
                  </Route>
                </Routes>
              </MemoryRouter>
            </MySuiAliasProvider>
          </MySuiAccountProvider>
        </MySuiEnvProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
