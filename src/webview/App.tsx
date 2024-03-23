import React, { useEffect, useState } from "react";
import "./style.css";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionArgument, TransactionBlock } from "@mysten/sui.js/transactions";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Aliases } from './components/Aliases';
import { sendMessage } from "./utils/wv_communicate_ext";
import { getDetailPackage } from "./utils/suiPackage";

export interface IAppProps { }

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {
    const suiClient = useSuiClient();
    const { network, selectNetwork } = useSuiClientContext();

    const [mnemonics, setMnemonics] = useState<string>("mouse hood crucial soup report axis awful point stairs guess scrap winter");

    const [packageId, setPackageId] = useState<string>("0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064");
    const [module, setModule] = useState<string>("counter");
    const [functionName, setFunctionName] = useState<string>("create");
    const [args, setArgs] = useState<TransactionArgument[]>([]);

    const [error, setError] = useState<string | undefined>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [response, setResponse] = useState<string>("");

    const [buildPath, setBuildPath] = useState<string>("");
    const [publishPath, setPublishPath] = useState<string>("");

    let keypair: Ed25519Keypair | null = null;

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        selectNetwork(e.target.value);
    };

    const handleAddArgs = () => {
        setArgs((prevArgs) => [...prevArgs, {
            index: null,
            kind: "Input",
            value: null,
            type: null
        }]);
    };

    const handleDeleteArgs = (index: number) => {
        setArgs((prevArgs) => prevArgs.filter((_, i) => i !== index));
    };

    const handleMnemonicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMnemonics(e.target.value);
    };

    const handleCall = async () => {
        try {
            keypair = Ed25519Keypair.deriveKeypair(
                mnemonics,
                DEFAULT_ED25519_DERIVATION_PATH,
            );
            const privateKey = keypair.getSecretKey();
            const publicKey = keypair.getPublicKey();
            const address = publicKey.toSuiAddress();

            const txb = new TransactionBlock();
            txb.setSender(address);
            txb.setGasOwner(address);
            txb.setGasPrice(10000);

            // add arguments to the transaction
            for (const arg of args) {
                if (arg.type === "object") {
                    txb.object(arg.value);
                } else {
                    txb.pure(arg.value);
                }
            }

            txb.moveCall({
                arguments: args,
                target: `${packageId}::${module}::${functionName}`
            });

            const txBytes = await txb.build({ client: suiClient });

            const serializedSignature = (await keypair.signTransactionBlock(txBytes))
                .signature;

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

            setIsError(false);

            const executionStatus = response.effects?.status;
            if (executionStatus?.status === "failure") {
                setError(executionStatus?.error);
            } else {
                setResponse(JSON.stringify(response.digest));
            }
            return response;
        } catch (err) {
            setIsError(true);
            setError(err.message);
            return err;
        }
    };

    useEffect(() => {
        getDetailPackage(suiClient, "0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064").then((data) => {
            const modules = Object.keys(data as {});

            if (data) {
                for (const module of modules) {
                    const { exposedFunctions } = data[module];

                }
            }
        }).catch(err => console.log(err));
    }, []);

    return (
        <>
            <h1>Sui Simulator</h1>
            <hr />
            <h2>Network</h2>
            <select value={network} onChange={handleNetworkChange}>
                <option>devnet</option>
                <option>testnet</option>
            </select>
            <hr />
            <h2>Buikd</h2>
            <Input placeholder="Path" value={buildPath} onChange={(e) => setBuildPath(e.target.value)} />
            <Button onClick={() => { sendMessage("BUILD", { path: buildPath }); }}>
                Build
            </Button>
            <h2>Publish</h2>
            <Input placeholder="Path" value={publishPath} onChange={(e) => setPublishPath(e.target.value)} />
            <Button onClick={() => { sendMessage("PUBLISH", { path: publishPath }); }}>
                Publish
            </Button>
            <hr />
            <h2>Call</h2>
            <div>
                <span>Mnemonics: </span>
                <Input placeholder="Mnemonics" value={mnemonics} onChange={handleMnemonicsChange} />
            </div>
            <div>
                <span>Package: </span>
                <Input placeholder="Package ID" value={packageId} onChange={(e) => setPackageId(e.target.value)} />
            </div>
            <div>
                <span>Module: </span>
                <Input placeholder="Module" value={module} onChange={(e) => setModule(e.target.value)} />
            </div>
            <div>
                <span>Function: </span>
                <Input placeholder="Function Name" value={functionName} onChange={(e) => setFunctionName(e.target.value)} />
            </div>
            <p>Args</p>
            {args.map((arg, index) => {
                return <> <input type="text" value={arg.value} onChange={(e) => {
                    const newArgs = [...args];
                    newArgs[index] = {
                        ...newArgs[index],
                        index,
                        value: e.target.value,
                        type: e.target.value.startsWith("0x") ? "object" : "pure"
                    };
                    setArgs((newArgs));
                }} />
                    <button onClick={() => handleDeleteArgs(index)}>X</button>
                </>;
            }

            )}
            <Button onClick={handleAddArgs}>
                Add args
            </Button>
            <Button onClick={() => {
                handleCall().then(resp => console.log(resp)).catch(err => console.log(err));
            }}>
                Call
            </Button>
            {!isError ? <p>Result: {response}</p> : <p>Error: {error}</p>}
            <hr />
            <Aliases />
        </>
    );
};