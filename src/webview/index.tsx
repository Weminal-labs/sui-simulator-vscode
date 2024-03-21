import { App } from "./App";
import React from "react";
import { createRoot } from 'react-dom/client';

declare const acquireVsCodeApi: <T = unknown>() => {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
};

const root = createRoot(document.getElementById("root"))
if (root) {
  root.render(<App />);
}

// Webpack HMR
// @ts-expect-error
if (import.meta.webpackHot) {
  // @ts-expect-error
  import.meta.webpackHot.accept()
}