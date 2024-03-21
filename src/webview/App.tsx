// import { messageHandler } from '@estruyf/vscode/dist/client';
import React from "react";
import { useState } from "react";
import "./style.css";
import { useSuiClientContext } from "@mysten/dapp-kit";

export interface IAppProps { }

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    // const sendMessage = () => {
    //     messageHandler.send('POST_DATA', { msg: 'Hello from the webview' });
    // };

    // const requestData = () => {
    //     messageHandler.request<string>('GET_DATA').then((msg) => {
    //         setMessage(msg);
    //     });
    // };

    // const requestWithErrorData = () => {
    //     messageHandler.request<string>('GET_DATA_ERROR')
    //         .then((msg) => {
    //             setMessage(msg);
    //         })
    //         .catch((err) => {
    //             setError(err);
    //         });
    // };

    // return (
    //     <div className='app'>
    //         <h1>Hello from the React Webview Starter</h1>

    //         <div className='app__actions'>
    //             <button onClick={sendMessage}>
    //                 Send message to extension
    //             </button>

    //             <button onClick={requestData}>
    //                 Get data from extension
    //             </button>

    //             <button onClick={requestWithErrorData}>
    //                 Get data with error
    //             </button>
    //         </div>

    //         {message && <p><strong>Message from the extension</strong>: {message}</p>}

    //         {error && <p className='app__error'><strong>ERROR</strong>: {error}</p>}
    //     </div>
    // );

    const { network, selectNetwork } = useSuiClientContext();
    const [currentNetwork, setCurrentNetwork] = useState("devnet");
    const [packageId, setPackageId] = useState<string>("");
    const [module, setModule] = useState<string>("");
    const [functionName, setFunctionName] = useState<string>("");
    const [args, setArgs] = useState<[]>([]);

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentNetwork(e.target.value);
        selectNetwork(e.target.value);
    };

    const handleAddArgs = () => {
        setArgs((prevArgs) => [...prevArgs, ""]);
    };

    return (
        <>
            <h1>Sui Simulator</h1>
            <hr />
            <select value={currentNetwork} onChange={handleNetworkChange}>
                <option>devnet</option>
                <option>testnet</option>
            </select>
            <hr />
            <input type="text" placeholder="Package ID" value={packageId} onChange={(e) => setPackageId(e.target.value)} />
            <input type="text" placeholder="Module" value={module} onChange={(e) => setModule(e.target.value)} />
            <input type="text" placeholder="Function Name" value={functionName} onChange={(e) => setFunctionName(e.target.value)} />
            <p>Args</p>
            {args.map((arg, index) =>
                <input key={index} type="text" value={arg} onChange={(e) => {
                    const newArgs = [...args];
                    newArgs[index] = e.target.value;
                    setArgs(newArgs);
                }} />
            )}
            <button onClick={handleAddArgs}>Add args</button>
        </>
    );
};