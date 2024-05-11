import React, { useState } from "react";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import { useMySuiEnv } from "../../context/MySuiEnvProvider";
import Merge from "../../components/Merge";
import Split from "../../components/Split";
import { BuildTestPublish } from "../buildTestPublish";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { shortenAddress, shortenObjectType } from "../../utils/address_shortener";
import { Aliases } from "../../components/Aliases";
import { Error } from "../../components/Error";
import { CopyIcon } from "../../icons/CopyIcon";
import { copyToClipBoard } from "../../utils";
// import { useHistory  } from 'react-router';

const Development = () => {
  const navigate = useNavigate();
//   const history = useHistory();

  const { currentAddress, currentGasObject } = useMySuiAccount();
  const [gasBudget, setGasBudget] = useState<number>(100000000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDigest, setCurrentDigest] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [objects, setObjects] = useState<any[]>([]);
  const { isSuiFile, setIsSuiFile, suiPath, setSuiPath, projectPath, setProjectPath } =
    useMySuiEnv();
  const handleNavigate = () => {
    navigate(-1);
  };
  const handleTest = async () => {
    await requestDataFromTerminal({
      cmd: SuiCommand.TEST_PACKAGE,
    });
  };
  const handleBuild = async () => {
    await requestDataFromTerminal({
      cmd: SuiCommand.BUILD_PACKAGE,
    });
  };
  const handlePublish = async () => {
    setIsLoading(true);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.PUBLISH_PACKAGE,
      gasBudget,
      gasObjectId: currentGasObject,
    });
    console.log(resp);

    const { stdout, stderr } = resp;
    // need to handle error case

    if (stderr.isError) {
      setError("Build Failed");
      setIsError(true);
      setIsLoading(false);
    } else {
      const { digest, objectChanges } = JSON.parse(stdout);
      setCurrentDigest(digest);
      console.log(digest);
      console.log(objectChanges);
      setIsLoading(false);
      setObjects(objectChanges);
    }
  };
  const packages = objects
    .map((obj) => {
      if (obj.type !== "published") {
        const packageName = obj.objectType.split("::")[0];
        return packageName;
      }
    })
    .filter((item) => item !== undefined);

  const packagePublish = objects.find((obj) => obj.type === "published");

  let uniquePackages = [...new Set(packages)];

  uniquePackages = uniquePackages.map((pkg) => {
    return {
      packageName: pkg,
      modules: [],
    };
  });
  const getModulesOfPackage = (packageName: string) => {
    console.log(packageName);
    const modules = objects
      .map((obj) => {
        const { objectType, type } = obj;
        if (type !== "published") {
          console.log(objectType);
          if (objectType.startsWith(packageName)) {
            console.log(objectType.split("::"));
            return objectType.split("::")[1];
          }
        }
      })
      .filter((item) => item !== undefined);
    const uniqueModules = [...new Set(modules)];
    console.log(uniqueModules);
    return uniqueModules;
  };

  const getObjectsOfModule = (packageName: string, moduleName: string) => {
    const objectOfModule = objects
      .map((obj) => {
        if (obj.type !== "published") {
          if (
            obj.objectType.startsWith(packageName) &&
            obj.objectType.split("::")[1] === moduleName
          ) {
            return obj;
          }
        }
      })
      .filter((item) => item !== undefined);
    return objectOfModule;
  };

  const getOwnerOfObject = (object: any) => {
    if (typeof object.owner === "object") {
      if (object.owner.hasOwnProperty("AddressOwner")) {
        return shortenAddress(object.owner.AddressOwner, 5);
      }
    } else {
      return object.owner;
    }
  };

  return (
    <>
      <div className="h-[200vh] grow overflow-y-scroll">
        <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
          <div className="flex flex-col w-full items-start gap-[36px] absolute top-[228px] left-0">
            <div
              className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
              onClick={handleNavigate}>
              <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                Development
              </div>
            </div>
            <div className="my-5 p-4 w-full">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                Current path
              </div>
              <div>{isSuiFile && suiPath && <p>{suiPath}</p>}</div>
            </div>
            <div className="flex flex-col gap-[24px] my-5 p-4  w-full rounded-[8px] border border-solid border-white">
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                Coin Function
              </div>
              <Merge />
              <Split />
            </div>
            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#676767]">
              <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                <button
                  className="items-center justify-center flex-[0_0_auto] border-white flex gap-[10px] px-[23px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid"
                  onClick={handleTest}>
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Test
                  </div>
                </button>
                <button
                  className="bg-white flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]"
                  onClick={handleBuild}>
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Build
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
              <button
                className="bg-[#000aff] flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]"
                onClick={handlePublish}>
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-white text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Publish
                </div>
              </button>
              <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center px-0 py-[4px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px]">
                  <div className="text-[18px] leading-[21.6px] relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] tracking-[0] whitespace-nowrap">
                    Gas Budget
                  </div>
                </div>
                <input
                  className="border-[#676767] gap-[10px] px-[23px] py-[16px] relative w-full rounded-[8px] border border-solid relative w-fit mt-[-1.00px] mr-[-8.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px] bg-[#0e0f0e]"
                  type="number"
                  value={gasBudget}
                  onChange={(e) => setGasBudget(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-center gap-[40px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Publisher
                  </div>
                  {currentAddress && (
                    <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                      {shortenAddress(currentAddress, 5)}
                    </div>
                  )}
                </div>
                <span className="border-l-2 border-white-100 w-[2px] h-[25px]"></span>
                <div className="inline-flex flex-col items-start gap-[8px] relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Gas Object
                  </div>
                  {currentGasObject && (
                    <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[16px] text-center tracking-[0] leading-[19.2px] whitespace-nowrap">
                      {shortenAddress(currentGasObject, 5)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isLoading ? (
                  "Publishing...."
                ) : (
                  <>
                    {isError && <Error errorMsg={error} />}
                    {!isError && (
                      <>
                        {currentDigest && (
                          <>
                            <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                              Result
                            </div>
                            <div>Transaction: {currentDigest}</div>
                          </>
                        )}

                        {packagePublish && (
                          <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                              <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-white">
                                <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                  <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                    <span className="text-[#8f8f8f]">Publish Object: </span>
                                    <span className="text-white">
                                      {shortenAddress(packagePublish.packageId, 5)}
                                    </span>
                                  </p>
                                  <CopyIcon
                                    handleClick={() => copyToClipBoard(packagePublish.packageId)}
                                  />
                                </div>
                                <div>
                                  {packagePublish.modules.map((module: any) => {
                                    return (
                                      <>
                                        <div>Module: {module}</div>
                                      </>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                          {uniquePackages.map((pkg) => {
                            return (
                              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                                  <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                    <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                      <span className="text-[#8f8f8f]">Package ID: </span>
                                      <span className="text-white">
                                        {shortenAddress(pkg.packageName, 5)}
                                      </span>
                                    </p>
                                    <CopyIcon
                                      handleClick={() => copyToClipBoard(packagePublish.packageId)}
                                    />
                                  </div>
                                  {getModulesOfPackage(pkg.packageName).map((module) => {
                                    return (
                                      <div>
                                        <div>Module: {module}</div>
                                        {getObjectsOfModule(pkg.packageName, module).map((obj) => {
                                          return (
                                            <div className="py-2">
                                              <div className="flex">
                                                Object id:{shortenAddress(obj.objectId, 5)}{" "}
                                                <CopyIcon
                                                  handleClick={() => copyToClipBoard(obj.objectId)}
                                                />
                                              </div>
                                              <div>
                                                Object type: {shortenObjectType(obj.objectType, 5)}
                                              </div>
                                              <div>Owner: {getOwnerOfObject(obj)}</div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}

                <Aliases />
          </div>
        </div>
      </div>
    </>
  );
};

export default Development;
