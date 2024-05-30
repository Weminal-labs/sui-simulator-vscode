import React, { useEffect, useRef, useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { convertWindowsToUnixPath, getFolderPathFromFilePath } from "../../utils";
import { FileWithPath } from "../../types";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiEnv } from "../../context/MySuiEnvProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import { messageHandler } from "@estruyf/vscode/dist/client";
import { InfoIcon } from "../../icons/InfoIcon";
import Merge from "../../components/Merge";
import Split from "../../components/Split";
import { Address } from "../gasAddress/address";
import { Gas } from "../gasAddress/gas";

export const SuiEnv = () => {
  const { network, selectNetwork } = useSuiClientContext();
  const { isSuiFile, setIsSuiFile, suiPath, setSuiPath, projectPath, setProjectPath } =
    useMySuiEnv();
  const [userNetworks, setUserNetworks] = useState<any[]>([]); // type later
  const [isLoading, setIsLoading] = 
  useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

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

  const handleNavigate = () => {
    navigate("/");
  };

  const handleToogle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSuiFile(e.target.checked);
  };

  useEffect(() => {
    if (!isSuiFile) {
      messageHandler.send("CHANGE_SUI_PATH", { suiPath: "sui" });
    }
  }, [isSuiFile]);

  useEffect(() => {
    async function getUserNetworks() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_NETWORKS,
      });
      const { stdout, stderr } = resp;
      const result = JSON.parse(stdout);
      let networks = result[0];
      networks = networks.map((network: any) => {
        if (network.rpc === "http://0.0.0.0:9000") {
          return {
            alias: "localnet",
            rpc: network.rpc,
          };
        } else if (network.rpc === "https://fullnode.mainnet.sui.io:443") {
          return {
            alias: "mainnet",
            rpc: network.rpc,
          };
        } else if (network.rpc === "https://fullnode.testnet.sui.io:443") {
          return {
            alias: "testnet",
            rpc: network.rpc,
          };
        } else if (network.rpc === "https://fullnode.devnet.sui.io:443") {
          return {
            alias: "devnet",
            rpc: network.rpc,
          };
        }
      });
      networks = networks.filter(
        (network: any) =>
          network.rpc !== "http://0.0.0.0:9000" &&
          network.rpc !== "https://fullnode.mainnet.sui.io:443"
      );
      console.log(networks);
      const currentNetwork = result[1];
      console.log(currentNetwork);
      // console.log(JSON.parse(stdout));
      setUserNetworks(networks);
      selectNetwork(currentNetwork);
      setIsLoading(false);
    }
    getUserNetworks();
  }, [suiPath]);

  useEffect(() => {
    // fileInputRef?.current?.setAttribute("directory", "");
    // fileInputRef?.current?.setAttribute("webkitdirectory", "");

    fileInputRef.current?.addEventListener("change", () => {
      setSuiPath(
        convertWindowsToUnixPath((fileInputRef.current?.files?.item(0) as FileWithPath)?.path)
      );
      console.log(fileInputRef.current?.files);
      console.log(
        convertWindowsToUnixPath((fileInputRef.current?.files?.item(0) as FileWithPath)?.path)
      );
      messageHandler.send("CHANGE_SUI_PATH", {
        suiPath: convertWindowsToUnixPath(
          (fileInputRef.current?.files?.item(0) as FileWithPath)?.path
        ),
      });
    });
  }, [fileInputRef]);

  useEffect(() => {
    projectInputRef?.current?.setAttribute("directory", "");
    projectInputRef?.current?.setAttribute("webkitdirectory", "");
    projectInputRef.current?.addEventListener("change", () => {
      setProjectPath(
        getFolderPathFromFilePath(
          convertWindowsToUnixPath((projectInputRef.current?.files?.item(0) as FileWithPath)?.path)
        )
      );
      messageHandler.send("CHANGE_PROJECT_PATH", {
        projectPath: getFolderPathFromFilePath(
          convertWindowsToUnixPath((projectInputRef.current?.files?.item(0) as FileWithPath)?.path)
        ),
      });
    });
  }, [projectInputRef]);

  return (
    <>
      <div className="h-[200vh] grow overflow-y-scroll">
        <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
          <div className="flex flex-col w-full items-start gap-[64px] absolute top-[228px] left-0">
            <div className="flex-col gap-[40px] p-[24px] self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
              <div
                className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
                onClick={handleNavigate}>
                <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                  Environment
                </div>
              </div>
              <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full">
                    {/* <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-1 grow rounded-[8px]">
                      <div className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-white relative w-fit mt-[-1.00px] text-[18px] tracking-[0] leading-[21.6px] break-all font-bold">
                        Sui binaries: Switch to binaries mode and locate your path
                      </div>
                      <div className="inline-flex items-center gap-[8px] relative flex-[0_0_auto]">
                        <Toggle defaultChecked={isSuiFile} icons={false} onChange={handleToogle} />
                      </div>
                    </div> */}
                    {/* not sure why bug if use conditional rendering? when this input element is not rendered for first time, the ref to this element will always be null */}
                    {/* <input
                      className={`w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e] hidden`}
                      type="file"
                      id="fileInput"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="fileInput"
                      className={`flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px] ${
                        isSuiFile ? "block" : "hidden"
                      }`}>
                      <span className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                        Choose a file
                      </span>
                    </label>

                    <div>{isSuiFile && suiPath && <p>{suiPath}</p>}</div> */}
                    {isLoading ? (
                      "Loading"
                    ) : (
                      <select
                        className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
                        value={network}
                        onChange={handleNetworkChange}>
                        <option value="">Choose network</option>
                        {userNetworks.map((network: any, index) => {
                          return (
                            <option className="text-[#8f8f8f] text-[18px]" key={index}>
                              {network.alias}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                  {/* <div className="flex flex-col items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="relative self-stretch w-full h-[54px]">
                                        <div className="w-full justify-between px-[24px] py-[16px] rounded-[8px] border border-solid border-[#5a5a5a] flex items-start relative">
                                            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                                                None
                                            </div>
                                            <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                                        </div>
                                    </div>
                                    <OptionList>
                                      <Option value="localnet" />
                                      <Option value="devnet" />
                                      <Option value="testnet" />
                                    </OptionList>
                                </div> */}
                </div>
              </div>
              <div className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  RPC Custom
                </div>
              </div>
              <div className="w-full">
                <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-1 grow rounded-[8px] mb-5">
                  <div className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-white relative w-fit mt-[-1.00px] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap text-bold">
                    Project Path
                  </div>
                </div>
                <input
                  className={`w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e] `}
                  type="file"
                  ref={projectInputRef}
                />
              </div>
              <div className="w-full">
              <Address />
                <Gas />
                {/* <Merge/>
                <Split/> */}
              </div>
              <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-white">
                    <div className="flex flex-col items-start justify-between relative self-stretch w-full flex-[0_0_auto] text-[18px]">
                      <div className="flex items-center">
                        <InfoIcon />
                        <span className="ml-2 text-bold">Note</span>
                      </div>
                      This section will help you configure your SUI path to connect to the Sui
                      Network. If your machine is installed from binaries, we've covered this with
                      binary mode, which allows you to locate your path on files.
                      <br />
                      <br /> Also, ensure that you have chosen the path where your project directory
                      is located, because we need to set your path (-p) when building a smart
                      contract
                    </div>
                  </div>
                </div>
              </div>
              <div>{projectPath && <p>{projectPath}</p>}</div>
            </div>
            <div className="absolute bg-blue-500 text-white font-bold py-2 px-4 rounded bottom-[10px] right-[24px]"
            onClick={()=>{navigate("/development")}}>
              Development
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
