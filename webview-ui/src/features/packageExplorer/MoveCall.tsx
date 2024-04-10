import React, { useEffect } from "react";
import { ActionType, MoveCallState } from "../../types";
import { Input } from "../../components/Input";
import { MoveCallActionType, MoveCallStatus, SuiCommand } from "../../../../src/enums";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Button } from "../../components/Button";
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "../../icons/ArrowDown";
import { Label } from "../../components/Label";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { shortenAddress, shortenObjectType } from "../../utils/address_shortener";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";

export interface IMoveCallProps {
  state: MoveCallState;
  dispatch: React.Dispatch<any>;
}

export const MoveCall = ({ state, dispatch }: IMoveCallProps) => {
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
          } else if ("Vector" in param) {
          } else if ("Struct" in param) {
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
        dispatch({ type: MoveCallActionType.SET_MODULES, payload: modules });
      } catch (err: any) {
        dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
      }
    }

    if (packageId) {
      getModules();
    }
  }, [packageId]);

  const modulesName = Object.keys(modules as {});
  const functionsName = Object.keys(functions as {});

  let keypair: Ed25519Keypair | null = null;

  // const handleCall = async () => {
  //   try {
  //     keypair = Ed25519Keypair.deriveKeypair(mnemonics, DEFAULT_ED25519_DERIVATION_PATH);
  //     const privateKey = keypair.getSecretKey();
  //     const publicKey = keypair.getPublicKey();
  //     const address = publicKey.toSuiAddress();

  //     const txb = new TransactionBlock();
  //     txb.setSender(address);
  //     txb.setGasOwner(address);
  //     txb.setGasPrice(10000);

  //     const argsFinal = argsUserInput.map((ele) => {
  //       if (ele.startsWith("0x")) {
  //         return txb.object(ele);
  //       } else {
  //         return txb.pure(ele);
  //       }
  //     });

  //     txb.moveCall({
  //       arguments: argsFinal,
  //       target: `${packageId}::${currentModule}::${currentFunction}`,
  //     });

  //     const txBytes = await txb.build({ client: suiClient });

  //     const serializedSignature = (await keypair.signTransactionBlock(txBytes)).signature;

  //     const response = await suiClient.executeTransactionBlock({
  //       transactionBlock: txBytes,
  //       signature: [serializedSignature],
  //       options: {
  //         showEffects: true,
  //         showObjectChanges: true,
  //         showBalanceChanges: true,
  //         showEvents: true,
  //         showInput: true,
  //         showRawInput: true,
  //       },
  //     });

  //     const executionStatus = response.effects?.status;
  //     if (executionStatus?.status === "failure") {
  //       dispatch({ type: MoveCallActionType.SET_ERROR, payload: executionStatus?.error });
  //     } else {
  //       dispatch({
  //         type: MoveCallActionType.SET_RESPONSE,
  //         payload: JSON.stringify(response.digest),
  //       });
  //     }
  //     return response;
  //   } catch (err: any) {
  //     dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
  //     return err;
  //   }
  // };

  const handleCall = async () => {
    try {
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.CALL_FUNCTION,
        packageId,
        moduleName: currentModule,
        functionName: currentFunction,
        args: argsUserInput,
      });
      const { stdout, stderr } = resp;
      // const objects = JSON.parse(stdout);
      console.log(stdout);
      console.log(stderr);
      dispatch({ type: MoveCallActionType.SET_RESPONSE, payload: stdout });
    } catch (err: any) {
      dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
    }
  }

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      <div className="bg-[#0e0f0e] overflow-hidden w-full h-[1122px]">
        <div className="relative w-[1023px] h-[1421px] top-[-178px] left-[-158px]">
          <div className="flex flex-col w-[640px] sidebar:w-[360px] items-start gap-[64px] py-0 absolute top-[228px] left-[198px]">
            <div className="flex flex-col items-start gap-[40px] px-0 py-[24px] relative self-stretch w-full flex-[0_0_auto] rounded-[16px]">
              <div className="flex items-start gap-[8px] relative self-stretch w-full flex-[0_0_auto]" onClick={handleNavigate}>
                <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                  Package Explorer
                </div>
              </div>
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
                  <input className="block w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]" placeholder="Package ID" value={packageId} onChange={handlePackageIdChange} />
                </div>
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
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start gap-[24px] p-[24px] relative self-stretch w-full flex-[0_0_auto] bg-[#0e1011] rounded-[8px] border border-solid border-[#676767]">
                  <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <p className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-transparent text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                      <span className="text-[#8f8f8f]">Package ID: </span>
                      <span className="text-white">{shortenAddress("0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331", 5)}</span>
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
                      <select className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]" value={currentModule} onChange={handleChooseModule}>
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
                      <select className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]" value={currentFunction} onChange={handleChooseFunction}>
                        <option selected value="">
                          Choose function
                        </option>
                        {functionsName.map((functionName) => {
                          return <option value={functionName}>{functionName}</option>;
                        })}
                      </select>
                    </>
                  )}

                  <div className="flex flex-col items-start justify-center gap-[10px] px-[24px] py-[16px] relative self-stretch w-full flex-[0_0_auto] rounded-[8px] border border-solid border-[#5a5a5a]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap">
                      Args
                    </div>
                    {currentFunction.length > 0 && (
                      <>
                        {args.map((arg, index) => {
                          return (
                            <div>
                              <input className="block w-full px-5 py-4 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]" placeholder={arg.startsWith("0x") ? shortenObjectType(arg, 5) : arg} value={argsUserInput[index] ? argsUserInput[index] : ""}
                                onChange={(e) => handleSetValueToArg(index, e.target.value)} />
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
                  <button className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]" onClick={handleCall}>
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
                      Call
                    </div>
                  </button>
                  {status === MoveCallStatus.FINISH && <p>Result: ${response}</p>}
                  {status === MoveCallStatus.ERROR && <p>Error: ${error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
