import React, { useEffect, useReducer, useState } from "react";
import { ActionType, MoveCallState } from "../../types";
import { MoveCallActionType, MoveCallStatus, SuiCommand } from "../../../../src/enums";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";
import { Label } from "../../components/Label";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { shortenAddress, shortenObjectType } from "../../utils/address_shortener";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { Error } from "../../components/Error";
import { Aliases } from "../../components/Aliases";

const initialState: MoveCallState = {
  status: MoveCallStatus.NORMAL,
  packageId: "",
  modules: [],
  currentModule: "",
  functions: {},
  currentFunction: "",
  args: [],
  argsUserInput: [],
  error: "",
  response: "",
};

const reducer = (state: MoveCallState, action: ActionType): MoveCallState => {
  const { type, payload } = action;
  switch (type) {
    case MoveCallActionType.SET_STATUS_NORMAL:
      return {
        ...state,
        status: MoveCallStatus.NORMAL,
      };
    case MoveCallActionType.SET_PACKAGE_ID:
      return {
        ...state,
        packageId: payload,
      };
    case MoveCallActionType.SET_MODULES:
      return {
        ...state,
        modules: payload,
      };

    case MoveCallActionType.SET_CURRENT_MODULE:
      return {
        ...state,
        currentModule: payload,
      };

    case MoveCallActionType.SET_FUNCTIONS:
      return {
        ...state,
        functions: payload,
      };

    case MoveCallActionType.SET_ERROR:
      return {
        ...state,
        status: MoveCallStatus.ERROR,
        error: payload,
      };

    case MoveCallActionType.SET_CURRENT_FUNCTION:
      return {
        ...state,
        currentFunction: payload,
      };

    case MoveCallActionType.RESET_ARGS:
      return {
        ...state,
        args: [],
      };

    case MoveCallActionType.RESET_ARGS_USER_INPUT:
      return {
        ...state,
        argsUserInput: [],
      };

    case MoveCallActionType.ADD_ARG:
      return {
        ...state,
        args: [...state.args, payload],
      };

    case MoveCallActionType.SET_VALUE_TO_ARG:
      const argsUserInput = [...state.argsUserInput];
      argsUserInput[payload.index] = payload.value;
      return {
        ...state,
        argsUserInput,
      };

    case MoveCallActionType.SET_RESPONSE:
      return {
        ...state,
        status: MoveCallStatus.FINISH,
        response: payload,
      };

    default:
      // @ts-ignore
      throw new Error(`Unhandled action type: ${type}`);
  }
};

export interface IMoveCallProps {
  state: MoveCallState;
  dispatch: React.Dispatch<any>;
}

export const MoveCallWidget = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <MoveCall state={state} dispatch={dispatch} />;
};

const MoveCall = ({ state, dispatch }: IMoveCallProps) => {
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

  const [isPackageIdValid, setIsPackageIdValid] = React.useState<boolean>(false);
  const [objects, setObjects] = useState<any[]>([]); // set type later
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gasBudget, setGasBudget] = useState<number>(100000000);

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

  const handleChooseFunction = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      dispatch({ type: MoveCallActionType.SET_CURRENT_FUNCTION, payload: e.target.value });
      dispatch({ type: MoveCallActionType.RESET_ARGS });
      dispatch({ type: MoveCallActionType.RESET_ARGS_USER_INPUT });

      const fn = functions[e.target.value];
      const { parameters } = fn;
      console.log(parameters);
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

  const handleSetValueToArg = (index: number, value: string) => {
    dispatch({
      type: MoveCallActionType.SET_VALUE_TO_ARG,
      payload: { index, value },
    });
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

  const handleCall = async () => {
    try {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.CALL_FUNCTION,
        packageId,
        moduleName: currentModule,
        functionName: currentFunction,
        args: argsUserInput,
        gasBudget,
      });
      const { stdout, stderr } = resp;
      // const objects = JSON.parse(stdout);

      if (stderr.isError) {
        dispatch({ type: MoveCallActionType.SET_ERROR, payload: stderr.message });
      } else {
        const { digest, objectChanges } = JSON.parse(stdout);
        setObjects(objectChanges);
        console.log(digest);
        console.log(objectChanges);
        dispatch({ type: MoveCallActionType.SET_RESPONSE, payload: stdout });
      }
      console.log(stdout);
      console.log(stderr);

      setIsLoading(false);
    } catch (err: any) {
      dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

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

  return (
    <>
      <div className="flex flex-col items-end gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex flex-col h-[92px] items-start gap-[8px] relative self-stretch w-full">
          <div className="flex w-full items-center justify-between px-0 py-[4px] relative flex-1 grow rounded-[8px]">
            <div className="relative w-fit mt-[-6.00px] mb-[-4.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Input Package
            </div>
            <Label
              className="!border-[#fefefe] !rounded-[4px] !flex-[0_0_auto] !border !border-solid !bg-[unset] uppercase"
              labelClassName="!text-white"
              status="active"
              text={network}
            />
          </div>
          <input
            className="block w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            placeholder="Package ID"
            value={packageId}
            onChange={handlePackageIdChange}
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
        {/* <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#ff008b]">
                                <div className="flex flex-col items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                                        <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#c83b7f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                                            Error: Couldn’t Find Package Id
                                        </p>
                                        <VuesaxLinearCloseCircle className="!relative !w-[24px] !h-[24px]" />
                                    </div>
                                </div>
                            </div> */}
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
              {/* <div className="flex items-start justify-between px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                      Module
                    </div>
                    <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                  </div> */}

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

              {/* <div className="flex items-start justify-between px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                      Function
                    </div>
                    <ArrowDown className="!relative !w-[24px] !h-[24px]" />
                  </div> */}

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
                  {/* <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                        U64
                      </div>
                    </div>
                    <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                        String
                      </div>
                    </div>
                    <div className="flex h-[56px] items-start gap-[10px] px-[24px] py-[16px] relative self-stretch w-full rounded-[8px] border border-solid border-[#5a5a5a]">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                        Hero
                      </div>
                    </div> */}
                </div>
              )}

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

              <button
                className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
                onClick={handleCall}>
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Call
                </div>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <p>Loading....</p>
        ) : (
          status === MoveCallStatus.FINISH && (
            <>
              <div className="relative w-fit [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap">
                Result
              </div>

              <div className="flex flex-col items-start gap-[16px] relative self-stretch w-full flex-[0_0_auto]">
                {uniquePackages.map((pkg) => {
                  return (
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                        <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                          <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                            <span className="text-[#8f8f8f]">Package ID: </span>
                            <span className="text-white">{shortenAddress(pkg.packageName, 5)}</span>
                          </p>
                          <Label
                            className="!flex-[0_0_auto] !pt-[3px] !pb-[7px] !px-[8px]"
                            labelClassName="!tracking-[-0.28px] !text-[14px] ![font-style:unset] !font-normal ![font-family:'Aeonik-Regular',Helvetica] !leading-[15.7px]"
                            status="hover"
                            text="Copy"
                          />
                        </div>
                        {getModulesOfPackage(pkg.packageName).map((module) => {
                          return (
                            <div>
                              <div>Module: {module}</div>
                              {getObjectsOfModule(pkg.packageName, module).map((obj) => {
                                return (
                                  <div>
                                    <div>Object id:{shortenAddress(obj.objectId, 5)}</div>
                                    <div>Object type: {shortenObjectType(obj.objectType, 5)}</div>
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

              {/* {objects.map((obj) => {
                      if (obj.type !== "published") {
                        return (
                          <>
                            <div>
                              <div>Object id: {obj.objectId}</div>
                              <div>Object type: {obj.objectType}</div>
                            </div>
                          </>
                        );
                      }
                    })} */}
            </>
          )
        )}

        {status === MoveCallStatus.ERROR && <Error errorMsg={error} />}
      </div>
    </>
  );
};
