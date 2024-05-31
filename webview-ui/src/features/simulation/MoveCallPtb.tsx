import React, { useReducer, useState } from "react";
import MoveCall from "./MoveCall";
import { ActionType, MoveCallState } from "../../types";
import { MoveCallActionType, MoveCallStatus } from "../../../../src/enums";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";


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
      throw new Error(`Unhandled action type: ${type}`);
  }
};

const MoveCallPtb: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <MoveCall state={state} dispatch={dispatch}/>;
};

export default MoveCallPtb;
