import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";
import React from "react";
import { createRoot } from "react-dom/client";
import { Route, MemoryRouter, Routes } from "react-router-dom";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { networkConfig } from "./configs/networkConfig";
import { RootLayout } from "./RootLayout";
import { SuiConfig } from "./features/suiConfig/v2";
import { GasAddress } from "./features/gasAddress/";
import { BuildTestPublish } from "./features/buildTestPublish/v2";
import { SuiConfigProvider } from "./context/SuiConfigProvider";
import { MySuiAccountProvider } from "./context/MySuiAccountProvider";
import Explorer from "./features/moveCall/v2/index";

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
        <SuiConfigProvider>
          <MySuiAccountProvider>
            <MemoryRouter initialEntries={["/"]}>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route index element={<App />} />
                  <Route path="environment" element={<SuiConfig />} />
                  <Route path="gas-address" element={<GasAddress />} />
                  <Route path="build-test-publish" element={<BuildTestPublish />} />
                  <Route path="explorer" element={<Explorer />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </MySuiAccountProvider>
        </SuiConfigProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
