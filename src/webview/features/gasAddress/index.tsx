import React from "react";
import Collapsible from "react-collapsible";
import { Address } from "./address";
import { Gas } from "./gas";

export const GasAddress = () => {
  return (
    <>
      <Collapsible trigger="Gases and Addresses">
        <div>
          <Address />
        </div>
        <div>
          <Gas/>
        </div>
      </Collapsible>
    </>
  );
};
