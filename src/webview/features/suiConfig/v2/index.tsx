import React, { useEffect, useRef, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { convertWindowsToUnixPath } from "../../../utils";
import { FileWithPath } from "../../../../types";
import { useSuiClientContext } from "@mysten/dapp-kit";
import Collapsible from "react-collapsible";
import { useSuiConfig } from "../../../context/SuiConfigProvider";
import { requestDataFromTerminal } from "../../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../enums";

export const SuiConfig = () => {
  const { network, selectNetwork } = useSuiClientContext();
  const { isSuiCargo, setIsSuiCargo, suiPath, setSuiPath } = useSuiConfig();
  const [userNetworks, setUserNetworks] = useState<any[]>([]); // type later
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.SWITCH_NETWORK,
      network: e.target.value,
    });
    const { stdout, stderr } = resp;
    console.log(stdout);
    selectNetwork(e.target.value);
    setIsLoading(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getUserNetworks() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_NETWORKS,
      });
      const { stdout, stderr } = resp;
      const result = JSON.parse(stdout);
      const networks = result[0];
      const currentNetwork = result[1];
      console.log(JSON.parse(stdout));
      setUserNetworks(networks);
      selectNetwork(currentNetwork);
      setIsLoading(false);
    }
    getUserNetworks();
  }, []);

  useEffect(() => {
    // fileInputRef?.current?.setAttribute("directory", "");
    // fileInputRef?.current?.setAttribute("webkitdirectory", "");

    fileInputRef.current?.addEventListener("change", () => {
      setSuiPath(
        convertWindowsToUnixPath(
          (fileInputRef.current?.files?.item(0) as FileWithPath)?.path
        )
      );
      console.log(fileInputRef.current?.files);
      console.log(
        convertWindowsToUnixPath(
          (fileInputRef.current?.files?.item(0) as FileWithPath)?.path
        )
      );
    });
  }, [fileInputRef]);

  return (
    <>
      <Collapsible trigger="Environments">
        <label>
          <Toggle
            defaultChecked={isSuiCargo}
            icons={false}
            onChange={(e) => setIsSuiCargo(e.target.checked)}
          />
          <span>Sui Cargo</span>
        </label>
        {!isSuiCargo && (
          <>
            <input type="file" ref={fileInputRef} />
            {suiPath && <p>{suiPath}</p>}
          </>
        )}
        {isLoading ? (
          "Loading"
        ) : (
          <select value={network} onChange={handleNetworkChange}>
            {userNetworks.map((network: any, index) => {
              return <option key={index}>{network.alias}</option>;
            })}
          </select>
        )}
        <button>RPC Custom</button>
      </Collapsible>
    </>
  );
};
