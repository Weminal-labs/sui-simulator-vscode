import React, { useEffect, useRef, useState } from "react";
import { EnvironmentIcon } from "./icons/EnvironmentIcon";
import { Tab } from "./components/Tab";
import { UserIcon } from "./icons/UserIcon";
import { RowVerticalIcon } from "./icons/RowVerticalIcon";
import { ExplorerIcon } from "./icons/ExplorerIcon";
import { Link } from "react-router-dom";
import { Logo } from "./components/Logo";
import { useMySuiEnv } from "./context/MySuiEnvProvider";
import { convertWindowsToUnixPath } from "./utils";
import { messageHandler } from "@estruyf/vscode/dist/client";
import { FileWithPath } from "./types";
import { requestDataFromTerminal } from "./utils/wv_communicate_ext";
import { SuiCommand } from "../../src/enums";
import { useMySuiAccount } from "./context/MySuiAccountProvider";

export interface IAppProps {}

export const App: React.FunctionComponent<IAppProps> = ({}: React.PropsWithChildren<IAppProps>) => {
  const { isSuiFile, setIsSuiFile, suiPath, setSuiPath, projectPath, setProjectPath } =
    useMySuiEnv();
    const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
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
  const handleToogle = (e: boolean) => {
    setIsSuiFile(e);
  };
  return (
    <>
      <div className="w-full relative min-h-screen grow">
        <div className="w-full">
          <div className="ml-10 mt-12 flex flex-col h-[800px] items-start gap-[32px] w-[640px] sidebar:w-[95%]">
            <div className="relative w-[400px] mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[48px] text-center tracking-[-2.56px] leading-[76.8px] whitespace-nowrap flex flex-row justify-evenly">
              <Logo className="w-[64px] h-[64px]" />
              <div>Sui simulator</div>
            </div>
            <div className="w-full flex justify-center 	">
              <div className=" flex justify-between text-black rounded-2xl bg-slate-50 w-[160px]  cursor-pointer border border-red-100	">
                <div
                  className={`px-4 py-3 grow border-r-2	rounded-2xl border-solid ${
                    isSuiFile ? "" : "bg-[#333333] text-[white]"
                  }`}
                  onClick={() => handleToogle(false)}>
                  Default
                </div>
                <div
                  className={`px-4 py-3 grow rounded-2xl ${isSuiFile ? "bg-[#333333] text-[white]" : ""}`}
                  onClick={() => handleToogle(true)}>
                  Config
                </div>
              </div>
            </div>
            <div className="w-full ">
              <input
                className={`w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e] hidden `}
                type="file"
                id="fileInput"
                ref={fileInputRef}
              />
              <label
                htmlFor="fileInput"
                className={`flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px] cursor-pointer ${
                  isSuiFile ? "block" : "hidden"
                }`}>
                <span className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Choose a file
                </span>
              </label>

              <div>{isSuiFile && suiPath && <p>{suiPath}</p>}</div>
            </div>
            <div className="flex flex-col gap-[16px] relative flex-[0_0_auto] w-full ">
              <Link to="/environment" className="focus:outline-none">
                <Tab
                  icon={<EnvironmentIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="Environment"
                />
              </Link>
              <Link to="/development" className="focus:outline-none">
                <Tab
                  icon={<UserIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="development"
                />
              </Link>
              {/* <Link to="build-test-publish" className="focus:outline-none ">
                <Tab
                  icon={<RowVerticalIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="Build, Test And Publish"
                />
              </Link> */}
            <Link to="simulation" className="focus:outline-none ">
              <Tab icon={<RowVerticalIcon className="!relative !w-[24px] !h-[24px]" />}
                title="Simulation"
              />
              </Link>
              <Link to="explorer" className="focus:outline-none">
                <Tab
                  icon={<ExplorerIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="Explorer"
                />
              </Link>
              {/* <Link to="/front-end-simulation" className="focus:outline-none">
                <Tab
                  icon={<ExplorerIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="Front end Simulation"
                />
              </Link> */}
              <Link to="/dynamic-object-graph" className="focus:outline-none">
                <Tab
                  icon={<ExplorerIcon className="!relative !w-[24px] !h-[24px]" />}
                  title="Dynamic object graph"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
