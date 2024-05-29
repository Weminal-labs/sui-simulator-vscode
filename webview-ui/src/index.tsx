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
import FrontEndSimulation from "./features/feSimulation";
import DynamicObjectGraph from "./features/dynObjGraph";
import Workflow from "./features/workflow";
import { CreateTransaction } from "./features/simulation/createTransaction";
import { AssignPbtProvider } from "./context/AssignPtbProvider";
import DetailTransaction from "./features/simulation/DetailTransaction";
import SavePtb from "./features/simulation/SavePtb";

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
                      <Route path="SavePtb" element={<SavePtb />} />

                      <Route path="build-test-publish" element={<BuildTestPublish />} />
                      <Route path="simulation" element={<Simulation />} />
                      <Route path="detail-transaction/:id" element={<DetailTransaction />} />
                      <Route path="create-transaction" element={<CreateTransaction />} />
                      <Route path="explorer" element={<PackageExplorer />} />

                      <Route path="front-end-simulation" element={<FrontEndSimulation />} />
                      <Route path="dynamic-object-graph" element={<DynamicObjectGraph />} />
                      <Route path="workflow" element={<Workflow />} />
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
