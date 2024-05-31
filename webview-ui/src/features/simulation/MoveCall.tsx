import React, { useEffect, useState } from "react";
import { Label } from "../../components/Label";
import { MoveCallState } from "../../types";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { MoveCallActionType, SuiCommand } from "../../../../src/enums";
import { shortenAddress, shortenObjectType } from "../../utils/address_shortener";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { SuiMoveNormalizedType } from "@mysten/sui.js/client";
import { Error } from "../../components/Error";
import Success from "../../components/Success";
export interface IMoveCallProps {
  state: MoveCallState;
  dispatch: React.Dispatch<any>;
}
const MoveCall = ({ state, dispatch }: IMoveCallProps) => {
  const { addMoveCallCommand } = useAssignContext();
  const [isErrorStatus, setIsErrorStatus] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<string>("");
  const [isSuccessStatus, setIsSuccessStatus] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<string>("");
  // move-call
  const suiClient = useSuiClient();
  const { network, selectNetwork } = useSuiClientContext();
  const {
    packageId,
    args,
    argsUserInput,
    currentFunction,
    currentModule,
    error,
    functions,
    modules,
    response,
    status,
  } = state;

  const handleSubmit = () => {
    if (packageId === "" || currentModule ==="" || currentFunction === "" || !argsUserInput.length) {
      setIsErrorStatus(true);
      setIsSuccessStatus(false);
      setErrorStatus("Please! Fill your information");
      return;
    }

    const command = `--move-call ${packageId}::${currentModule}::${currentFunction} "<${args.join(
      ","
    )}>" ${argsUserInput.join(" ")} \\\n`;
    console.log("🚀 ~ command ~ command:", command);
    addMoveCallCommand(command, packageId, currentModule, currentFunction, argsUserInput, args);
    setIsErrorStatus(false);
    setIsSuccessStatus(true);
    setSuccessStatus("Add Move-call command to PTB");
  };
  const [isPackageIdValid, setIsPackageIdValid] = React.useState<boolean>(false);
  const [objects, setObjects] = useState<any[]>([]); // set type later
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePackageIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: MoveCallActionType.SET_PACKAGE_ID, payload: e.target.value });
  };
  const handleChooseModule = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      dispatch({ type: MoveCallActionType.SET_CURRENT_MODULE, payload: e.target.value });

      try {
        const module = await suiClient.getNormalizedMoveModule({
          package: packageId,
          module: e.target.value,
        });
        const { exposedFunctions } = module;
        dispatch({ type: MoveCallActionType.SET_FUNCTIONS, payload: exposedFunctions });
      } catch (err: any) {
        dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
      }
    }
  };

  const handleSetValueToArg = (index: number, value: string) => {
    dispatch({
      type: MoveCallActionType.SET_VALUE_TO_ARG,
      payload: { index, value },
    });
  };
  const handleChooseFunction = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      dispatch({ type: MoveCallActionType.SET_CURRENT_FUNCTION, payload: e.target.value });
      dispatch({ type: MoveCallActionType.RESET_ARGS });
      dispatch({ type: MoveCallActionType.RESET_ARGS_USER_INPUT });

      const fn = functions[e.target.value];
      const { parameters } = fn;
      for (const param of parameters) {
        // handle typescript error by this way is suck => refactor later
        if (typeof param === "object") {
          if ("MutableReference" in param) {
            if (typeof param.MutableReference === "object" && "Struct" in param.MutableReference) {
              let {
                Struct: { address, module, name },
              } = param.MutableReference;
              if (name !== "TxContext") {
                dispatch({
                  type: MoveCallActionType.ADD_ARG,
                  payload: `${address}::${module}::${name}`,
                });
              }
            }
          } else if ("Reference" in param) {
            if (typeof param.Reference === "object" && "Struct" in param.Reference) {
              let {
                Struct: { address, module, name },
              } = param.Reference;
              if (name !== "TxContext") {
                dispatch({
                  type: MoveCallActionType.ADD_ARG,
                  payload: `${address}::${module}::${name}`,
                });
              }
            }
          } else if ("Vector" in param) {
          } else if ("Struct" in param) {
            if (typeof param.Struct === "object") {
              let {
                Struct: { address, module, name },
              } = param;
              if (name !== "TxContext") {
                dispatch({
                  type: MoveCallActionType.ADD_ARG,
                  payload: `${address}::${module}::${name}`,
                });
              }
            }
          } else if ("TypeParameter" in param) {
          }
        } else {
          dispatch({ type: MoveCallActionType.ADD_ARG, payload: param });
        }
      }
    }
  };

  useEffect(() => {
    async function getModules() {
      try {
        const modules = await suiClient.getNormalizedMoveModulesByPackage({ package: packageId });
        setIsPackageIdValid(true);
        dispatch({ type: MoveCallActionType.SET_STATUS_NORMAL });
        dispatch({ type: MoveCallActionType.SET_MODULES, payload: modules });
      } catch (err: any) {
        dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
        setIsPackageIdValid(false);
      }
    }

    if (packageId) {
      getModules();
    }
  }, [packageId]);

  const modulesName = Object.keys(modules as {});
  const functionsName = Object.keys(functions as {});

  const packages = objects
    .map((obj) => {
      if (obj.type !== "published") {
        const packageName = obj.objectType.split("::")[0];
        return packageName;
      }
    })
    .filter((item) => item !== undefined);

  let uniquePackages = [...new Set(packages)];

  uniquePackages = uniquePackages.map((pkg) => {
    return {
      packageName: pkg,
      modules: [],
    };
  });

  const getModulesOfPackage = (packageName: string) => {
    const modules = objects
      .map((obj) => {
        const { objectType, type } = obj;
        if (type !== "published") {
          if (objectType.startsWith(packageName)) {
            return objectType.split("::")[1];
          }
        }
      })
      .filter((item) => item !== undefined);
    const uniqueModules = [...new Set(modules)];
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

  return (
    <div className="flex flex-col gap-7 mt-5 w-full">
      <div className="flex flex-row justify-between">
        <label className="block mb-2 text-lg font-medium">Package ID</label>
        <Label
          className="!border-[#fefefe] !rounded-[4px] !flex-[0_0_auto] !border !border-solid !bg-[unset] uppercase"
          labelClassName="!text-white"
          status="active"
          text={network}
        />
      </div>
      <div className="flex flex-col ">
        <div className="relative block flex-1">
          <input
            type="text"
            value={packageId}
            placeholder="Package ID"
            // onChange={(e) => setPackageId(e.target.value)}
            onChange={handlePackageIdChange}
            className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
          />
        </div>
      </div>
      <div className="flex flex-col">
        {isPackageIdValid && (
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
              <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  <span className="text-[#8f8f8f]">Package ID: </span>
                  <span className="text-white">{shortenAddress(packageId, 5)}</span>
                </p>
                <Label
                  className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                  labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                  status="hover"
                  text="Copy"
                />
              </div>
              {modulesName.length > 0 && (
                <>
                  <select
                    className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
                    value={currentModule}
                    onChange={handleChooseModule}>
                    <option selected value="">
                      Choose module
                    </option>
                    {modulesName.map((moduleName) => {
                      return <option value={moduleName}>{moduleName}</option>;
                    })}
                  </select>
                </>
              )}

              {currentModule.length > 0 && (
                <>
                  <select
                    className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
                    value={currentFunction}
                    onChange={handleChooseFunction}>
                    <option selected value="">
                      Choose function
                    </option>
                    {functionsName.map((functionName) => {
                      return <option value={functionName}>{functionName}</option>;
                    })}
                  </select>
                </>
              )}

              {args.length > 0 && (
                <div className="flex flex-col items-start justify-center gap-[10px] px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                    Args
                  </div>
                  {currentFunction.length > 0 && (
                    <>
                      {args.map((arg, index) => {
                        return (
                          <div className="w-full">
                            <input
                              className="block w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
                              placeholder={arg.startsWith("0x") ? shortenObjectType(arg, 5) : arg}
                              value={argsUserInput[index] ? argsUserInput[index] : ""}
                              onChange={(e) => handleSetValueToArg(index, e.target.value)}
                            />
                            {/* value need to set like above if not will have bug when choose between functions */}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Command
            </div>
          </button>
        </div>
        <div className="flex-1  h-[60px]">
          {isErrorStatus && (
            <Error errorMsg={errorStatus} closeError={() => setIsErrorStatus(false)} />
          )}
          {isSuccessStatus && (
            <Success successMsg={successStatus} closeSuccess={() => setIsSuccessStatus(false)} />
          )}
        </div>
        {/* <div className="flex-1  h-[60px] ">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div> */}
      </div>
    </div>
  );
};

export default MoveCall;
