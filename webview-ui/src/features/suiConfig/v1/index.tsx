import React, { useState } from "react";
import { Input } from "../../../components/Input";
import { useSuiClientContext } from "@mysten/dapp-kit";

export default function index() {
  const { network, selectNetwork } = useSuiClientContext();
  const [suiPath, setSuiPath] = useState<string>("");

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectNetwork(e.target.value);
  };

  return (
    <>
      <h2>Setup Sui</h2>
      <Input
        placeholder="Sui binary path"
        value={suiPath}
        onChange={(e) => setSuiPath(e.target.value)}
      />
      <h2>Network</h2>
      <select value={network} onChange={handleNetworkChange}>
        <option>devnet</option>
        <option>testnet</option>
      </select>
    </>
  );
}
