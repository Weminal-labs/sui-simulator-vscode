import { SuiMoveNormalizedFunction } from "@mysten/sui.js/client";
import { MoveCallStatus } from "../enums";

export interface ActionType {
    type: string,
    payload: any
};

export interface MoveCallState {
    mnemonics: string,
    status: MoveCallStatus,
    packageId: string,
    modules: string[],
    currentModule: string,
    functions: {
        [key: string]: SuiMoveNormalizedFunction;
    },
    currentFunction: string;
    args: string[],
    argsUserInput: string[],
    error: string,
    response: string,
}