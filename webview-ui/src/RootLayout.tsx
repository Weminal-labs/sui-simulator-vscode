import React from "react";
import { Outlet } from "react-router-dom";
import { Rainbow } from "./components/Rainbow";
import { Feedback } from "./components/Feedback";
import TestComponent from "./components/Test";

export const RootLayout = () => {
  return (
    <div className="relative bg-[#0e0f0e] flex flex-col justify-between w-full min-h-screen">
      <Outlet />
      <Rainbow />
      <Feedback />
    </div>
  );
};
