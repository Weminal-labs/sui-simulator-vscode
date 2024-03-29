import React, { useReducer, useState } from "react";
import "./style.css";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Aliases } from './components/Aliases';
import { ActionType, MoveCallState } from "../types";
import { MoveCallActionType, MoveCallStatus } from "../enums";
import { MoveCall } from "./features/moveCall/v2";
import { SuiConfig } from "./features/suiConfig/v2";
import { messageHandler } from "@estruyf/vscode/dist/client";
import { SuiConfigProvider } from "./context/SuiConfigProvider";
import { GasAddress } from "./features/gasAddress";

const initialState: MoveCallState = {
    mnemonics: "mouse hood crucial soup report axis awful point stairs guess scrap winter",
    status: MoveCallStatus.BEGIN,
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
        case MoveCallActionType.SET_MNEMONICS:
            return {
                ...state,
                mnemonics: payload,
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
            throw new Error(`Unhandled action type: ${type}`);
    }
};

const sendMessage = (action: string, payload: any) => {
    messageHandler.send(action, payload); // action, payload like redux
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
            <SuiConfigProvider>
                <h1>Sui Simulator</h1>
                <hr />
                <SuiConfig/>
                <hr />
                <GasAddress />
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
            </SuiConfigProvider>
        </>
    );
};