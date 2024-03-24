import React, { useEffect } from 'react';
import { MoveCallState } from '../../../../types';
import { Input } from '../../../components/Input';
import { MoveCallActionType, MoveCallStatus } from '../../../../enums';
import { useSuiClient } from '@mysten/dapp-kit';
import { Button } from '../../../components/Button';

export interface IMoveCallProps {
    state: MoveCallState;
    dispatch: React.Dispatch<any>;
}

export const MoveCall = ({ state, dispatch }: IMoveCallProps) => {
    const suiClient = useSuiClient();

    const { mnemonics, packageId, args, argsUserInput, currentFunction, currentModule, error, functions, modules, response, status } = state;

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
                const module = await suiClient.getNormalizedMoveModule({ package: packageId, module: e.target.value });
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
        }
    };

    useEffect(() => {
        async function getModules() {
            try {
                const modules = await suiClient.getNormalizedMoveModulesByPackage({ package: packageId });
                console.log(modules);
                dispatch({ type: MoveCallActionType.SET_MODULES, payload: modules });
            } catch (err: any) {
                dispatch({ type: MoveCallActionType.SET_ERROR, payload: err.message });
            }
        }

        getModules();
    }, [packageId]);

    const modulesName = Object.keys(modules as {});
    const functionsName = Object.keys(functions as {});

    // let keypair: Ed25519Keypair | null = null;

    // const handleCall = async () => {
    //     try {
    //         keypair = Ed25519Keypair.deriveKeypair(
    //             mnemonics,
    //             DEFAULT_ED25519_DERIVATION_PATH,
    //         );
    //         const privateKey = keypair.getSecretKey();
    //         const publicKey = keypair.getPublicKey();
    //         const address = publicKey.toSuiAddress();

    //         const txb = new TransactionBlock();
    //         txb.setSender(address);
    //         txb.setGasOwner(address);
    //         txb.setGasPrice(10000);

    //         // add arguments to the transaction
    //         for (const arg of args) {
    //             if (arg.type === "object") {
    //                 txb.object(arg.value);
    //             } else {
    //                 txb.pure(arg.value);
    //             }
    //         }

    //         txb.moveCall({
    //             arguments: args,
    //             target: `${packageId}::${module}::${functionName}`
    //         });

    //         const txBytes = await txb.build({ client: suiClient });

    //         const serializedSignature = (await keypair.signTransactionBlock(txBytes))
    //             .signature;

    //         const response = await suiClient.executeTransactionBlock({
    //             transactionBlock: txBytes,
    //             signature: [serializedSignature],
    //             options: {
    //                 showEffects: true,
    //                 showObjectChanges: true,
    //                 showBalanceChanges: true,
    //                 showEvents: true,
    //                 showInput: true,
    //                 showRawInput: true,
    //             },
    //         });

    //         setIsError(false);

    //         const executionStatus = response.effects?.status;
    //         if (executionStatus?.status === "failure") {
    //             setError(executionStatus?.error);
    //         } else {
    //             setResponse(JSON.stringify(response.digest));
    //         }
    //         return response;
    //     } catch (err: any) {
    //         setIsError(true);
    //         setError(err.message);
    //         return err;
    //     }
    // };

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
                <span>Module: </span>
                {status !== MoveCallStatus.ERROR && <select name="" id="" value={currentModule} onChange=
                    {handleChooseModule}>
                    <option selected value="">Choose module</option>
                    {modulesName.map((moduleName) => {
                        return <option value={moduleName}>{moduleName}</option>;
                    })}
                </select>}
            </div>
            <div>
                <span>Function: </span>
                {currentModule.length > 0 && <select name="" id="" value={currentFunction} onChange=
                    {handleChooseFunction}>
                    <option selected value="">Choose function</option>
                    {functionsName.map((functionName) => {
                        return <option value={functionName}>{functionName}</option>;
                    })}
                </select>}
            </div>
            <p>Args</p>

            <Button onClick={() => { }}>
                Call
            </Button>
            {status === MoveCallStatus.ERROR && <p>Error: ${error}</p>}
        </>
    );
};
