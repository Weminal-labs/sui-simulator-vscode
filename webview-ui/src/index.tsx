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
import Development from "./features/development";
import Simulation from "./features/simulation";
import { CreateTransaction } from "./features/simulation/createTransaction";
import { AssignPbtProvider } from "./context/AssignPtbProvider";

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
              <AssignPbtProvider>
                <MemoryRouter initialEntries={["/"]}>
                  <Routes>
                    <Route element={<RootLayout />}>
                      <Route index element={<App />} />
                      <Route path="environment" element={<SuiEnv />} />
                      <Route path="gas-address" element={<GasAddress />} />
                      <Route path="development" element={<Development />} />

                      <Route path="build-test-publish" element={<BuildTestPublish />} />
                      <Route path="simulation" element={<Simulation />} />
                      <Route path="create-transaction" element={<CreateTransaction />} />
                      <Route path="explorer" element={<PackageExplorer />} />
                    </Route>
                  </Routes>
                </MemoryRouter>
              </AssignPbtProvider>
            </MySuiAliasProvider>
          </MySuiAccountProvider>
        </MySuiEnvProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
