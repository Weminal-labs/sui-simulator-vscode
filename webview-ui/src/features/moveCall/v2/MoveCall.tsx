import React, { useEffect } from "react";
import { ActionType, MoveCallState } from "../../../types";
import { Input } from "../../../components/Input";
import { MoveCallActionType, MoveCallStatus } from "../../../../../src/enums";
import { useSuiClient } from "@mysten/dapp-kit";
import { Button } from "../../../components/Button";
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export interface IMoveCallProps {
  state: MoveCallState;
  dispatch: React.Dispatch<any>;
}

export const MoveCall = ({ state, dispatch }: IMoveCallProps) => {
  const suiClient = useSuiClient();

  const {
    mnemonics,
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

  const handleMnemonicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: MoveCallActionType.SET_MNEMONICS, payload: e.target.value });
  };

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

  const handleCall = async () => {
    try {
      keypair = Ed25519Keypair.deriveKeypair(mnemonics, DEFAULT_ED25519_DERIVATION_PATH);
      const privateKey = keypair.getSecretKey();
      const publicKey = keypair.getPublicKey();
      const address = publicKey.toSuiAddress();

      const txb = new TransactionBlock();
      txb.setSender(address);
      txb.setGasOwner(address);
      txb.setGasPrice(10000);

      const argsFinal = argsUserInput.map((ele) => {
        if (ele.startsWith("0x")) {
          return txb.object(ele);
        } else {
          return txb.pure(ele);
        }
      });

      txb.moveCall({
        arguments: argsFinal,
        target: `${packageId}::${currentModule}::${currentFunction}`,
      });

      const txBytes = await txb.build({ client: suiClient });

      const serializedSignature = (await keypair.signTransactionBlock(txBytes)).signature;

      const response = await suiClient.executeTransactionBlock({
        transactionBlock: txBytes,
        signature: [serializedSignature],
        options: {
          showEffects: true,
          showObjectChanges: true,
          showBalanceChanges: true,
          showEvents: true,
          showInput: true,
          showRawInput: true,
        },
      });

      const executionStatus = response.effects?.status;
      if (executionStatus?.status === "failure") {
        dispatch({ type: MoveCallActionType.SET_ERROR, payload: executionStatus?.error });
      } else {
        dispatch({
          type: MoveCallActionType.SET_RESPONSE,
          payload: JSON.stringify(response.digest),
        });
      }
      return response;
    } catch (err: any) {
      dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
      return err;
    }
  };

  return (
    <>
      <h2>Call</h2>
      <div>
        <span>Mnemonics: </span>
        <Input placeholder="Mnemonics" value={mnemonics} onChange={handleMnemonicsChange} />
      </div>
      <div>
        <span>Package: </span>
        <Input placeholder="Package ID" value={packageId} onChange={handlePackageIdChange} />
      </div>
      <div>
        {modulesName.length > 0 && (
          <>
            <span>Module: </span>
            <select name="" id="" value={currentModule} onChange={handleChooseModule}>
              <option selected value="">
                Choose module
              </option>
              {modulesName.map((moduleName) => {
                return <option value={moduleName}>{moduleName}</option>;
              })}
            </select>
          </>
        )}
      </div>
      <div>
        {currentModule.length > 0 && (
          <>
            <span>Function: </span>
            <select name="" id="" value={currentFunction} onChange={handleChooseFunction}>
              <option selected value="">
                Choose function
              </option>
              {functionsName.map((functionName) => {
                return <option value={functionName}>{functionName}</option>;
              })}
            </select>
          </>
        )}
      </div>
      {currentFunction.length > 0 && (
        <>
          <p>Args</p>
          {args.map((arg, index) => {
            return (
              <div key={arg}>
                <Input
                  placeholder={arg}
                  value={argsUserInput[index] ? argsUserInput[index] : ""}
                  onChange={(e) => handleSetValueToArg(index, e.target.value)}
                />
                {/* value need to set like above if not will have bug when choose between functions */}
              </div>
            );
          })}
        </>
      )}

      <Button onClick={handleCall}>Call</Button>
      {status === MoveCallStatus.FINISH && <p>Result: ${response}</p>}
      {status === MoveCallStatus.ERROR && <p>Error: ${error}</p>}
    </>
  );
};
