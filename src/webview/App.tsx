import React, { useReducer, useState } from "react";
import "./style.css";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Aliases } from './components/Aliases';
import { sendMessage } from "./utils/wv_communicate_ext";
import { ActionType, MoveCallState } from "../types";
import { MoveCallActionType, MoveCallStatus } from "../enums";
import { MoveCall } from "./features/moveCall/v2";

const initialState: MoveCallState = {
    mnemonics: "mouse hood crucial soup report axis awful point stairs guess scrap winter",
    status: MoveCallStatus.ENTER_PACKAGE_ID,
    packageId: "0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064",
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
        case MoveCallActionType.SET_MNEMONICS:
            return {
                ...state,
                mnemonics: payload,
            };
        case MoveCallActionType.SET_PACKAGE_ID:
            return {
                ...state,
                status: MoveCallStatus.ENTER_PACKAGE_ID,
                packageId: payload,
            };
        case MoveCallActionType.SET_MODULES:
            return {
                ...state,
                status: MoveCallStatus.CHOOSE_MODULE,
                modules: payload,
            };

        case MoveCallActionType.SET_CURRENT_MODULE:
            return {
                ...state,
                status: MoveCallStatus.CHOOSE_FUNCTION,
                currentModule: payload,
            };

        case MoveCallActionType.SET_FUNCTIONS:
            return {
                ...state,
                status: MoveCallStatus.ENTER_ARGS,
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
                status: MoveCallStatus.CALL,
                currentFunction: payload,
            };

        default:
            throw new Error(`Unhandled action type: ${type}`);
    }
};

export interface IAppProps { }

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {
    const suiClient = useSuiClient();
    const { network, selectNetwork } = useSuiClientContext();

    const [state, dispatch] = useReducer(reducer, initialState);

    const [buildPath, setBuildPath] = useState<string>("");
    const [publishPath, setPublishPath] = useState<string>("");
    const [suiPath, setSuiPath] = useState<string>("");

    const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        selectNetwork(e.target.value);
    };

    return (
        <>
            <h1>Sui Simulator</h1>
            <hr />
            <h2>
                Setup Sui
            </h2>
            <Input placeholder="Sui binary path" value={suiPath} onChange={(e) => setSuiPath(e.target.value)} />
            <h2>Network</h2>
            <select value={network} onChange={handleNetworkChange}>
                <option>devnet</option>
                <option>testnet</option>
            </select>
            <hr />
            <h2>Build</h2>
            <Input placeholder="Package Path" value={buildPath} onChange={(e) => setBuildPath(e.target.value)} />
            <Button onClick={() => { sendMessage("BUILD", { packagePath: buildPath, suiPath }); }}>
                Build
            </Button>
            <h2>Publish</h2>
            <Input placeholder="Package Path" value={publishPath} onChange={(e) => setPublishPath(e.target.value)} />
            <Button onClick={() => { sendMessage("PUBLISH", { packagePath: publishPath, suiPath }); }}>
                Publish
            </Button>
            <hr />

            <MoveCall state={state} dispatch={dispatch} />

            <hr />
            <Aliases />
        </>
    );
};