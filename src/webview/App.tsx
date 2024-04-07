import React, { useReducer, useState } from "react";
import "./style.css";
import { useSuiClient, useSuiClientContext } from "@mysten/dapp-kit";
import { Aliases } from './components/Aliases';
import { ActionType, MoveCallState } from "../types";
import { MoveCallActionType, MoveCallStatus } from "../enums";
import { MoveCall } from "./features/moveCall/v2";
import { SuiConfig } from "./features/suiConfig/v2";
import { messageHandler } from "@estruyf/vscode/dist/client";
import { SuiConfigProvider } from "./context/SuiConfigProvider";
import { GasAddress } from "./features/gasAddress";
import { BuildTestPublish } from "./features/buildTestPublish";
import { MySuiAccountProvider } from "./context/MySuiAccountProvider";
import { EnvironmentIcon } from "./icons/EnvironmentIcon";
import { Tab } from "./components/Tab";
import { UserIcon } from "./icons/UserIcon";
import { RowVerticalIcon } from "./icons/RowVerticalIcon";
import { ExplorerIcon } from "./icons/ExplorerIcon";
import { Link } from "react-router-dom";

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
        <MySuiAccountProvider>
          {/* <h1 className="text-red-500">Sui Simulator</h1>
                    <hr />
                    <SuiConfig/>
                    <hr />
                    <GasAddress />
                    <hr />
                    <BuildTestPublish />
          <hr />

                    <MoveCall state={state} dispatch={dispatch} />

                    <hr />
                    <Aliases /> */}

          <div className="overflow-hidden w-full h-[1024px] relative">
            <div className="w-full h-[725px]">
              <div className="ml-10 mt-12 inline-flex flex-col h-[500px] items-start gap-[64px]">
                <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[64px] text-center tracking-[-2.56px] leading-[76.8px] whitespace-nowrap">
                  Sui simulator
                </div>
                <div className="inline-flex flex-col items-start gap-[16px] relative flex-[0_0_auto]">
                  <Link to="/environment">
                    <Tab icon={<EnvironmentIcon className="!relative !w-[24px] !h-[24px]" />} title="Environment" />
                  </Link>
                  {/* <Environment /> */}
                  <Link to="/gas-address">
                    <Tab icon={<UserIcon className="!relative !w-[24px] !h-[24px]" />} title="Gases And Address" />
                  </Link>
                  {/* <GasAddress /> */}
                  <Link to="build-test-publish">
                    <Tab icon={<RowVerticalIcon className="!relative !w-[24px] !h-[24px]" />} title="Build, Test And Publish" />
                  </Link>
                  <Tab icon={<ExplorerIcon className="!relative !w-[24px] !h-[24px]" />} title="Explorer" />
                </div>
              </div>
            </div>
          </div>


        </MySuiAccountProvider>
      </SuiConfigProvider>
    </>
  );
};