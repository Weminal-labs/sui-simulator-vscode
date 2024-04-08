import React, { useState } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { DEFAULT_ED25519_DERIVATION_PATH, Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions';
import { useSuiClient } from '@mysten/dapp-kit';

export default function index() {
    const suiClient = useSuiClient();

    const [mnemonics, setMnemonics] = useState<string>("mouse hood crucial soup report axis awful point stairs guess scrap winter");

    const [packageId, setPackageId] = useState<string>("0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064");
    const [module, setModule] = useState<string>("counter");
    const [functionName, setFunctionName] = useState<string>("create");
    const [args, setArgs] = useState<TransactionArgument[]>([]);

    const [error, setError] = useState<string | undefined>("");
    const [isError, setIsError] = useState<boolean>(false);
    const [response, setResponse] = useState<string>("");

    let keypair: Ed25519Keypair | null = null;

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
        } catch (err: any) {
            setIsError(true);
            setError(err.message);
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
        </>
    );
};
