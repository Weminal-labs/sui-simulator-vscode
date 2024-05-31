import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useAssignContext } from "../../context/AssignPtbProvider";

import { Controlled as CodeMirror } from "react-codemirror2";

// Import Codemirror styles and modes
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/shell/shell.js";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import { Error } from "../../components/Error";
import Success from "../../components/Success";
import { PRIMITIVES, ptbToCode } from "../../utils/gen_ptb";
import { Editor } from "@monaco-editor/react";
// import '../../css/codeBlockLines.css';
interface DetailParams {
  id: string;
}
// se sd useContext de lay transaction
// const transactions = [
//   { id: 1, name: "test_game_func", command: `sui client ptb \\ \n--assign A none` },
//   { id: 2, name: "test_command", command: `sui client ptb \\ \n--assign to_add @0x123` },
// ];

const DetailTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, disablePtb } = useAssignContext();

  const transaction = state.transactions.find((t) => t.id === id);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const [textarea, setTextarea] = useState<string>(transaction?.command || "");
  const [editorHeight, setEditorHeight] = useState("auto");
  const editorRef = useRef<any>(null);

  if (!transaction) {
    return <div> Transaction not found</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(textarea);
  };

  const handleNavigate = () => {
    navigate("/simulation");
  };
  const handleRun = async () => {
    console.log(transaction.command);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.EXEC_PTB,
      finalCmd: transaction.command,
    });
    const { stdout, stderr } = resp;

    if (stderr.isError) {
      setError(stderr.message);
      setIsError(true);
      setIsSuccess(false);
    } else {
      disablePtb(transaction.id);
      setIsError(false);
      setIsSuccess(true);
      setSuccess("Run PTB command");

      setTimeout(() => {
        setIsSuccess(false);
        setSuccess("");
      }, 3000);
    }
  };

  function handleEditorChange(value: any, event: any) {
    setCode(value);
  }

  const options = {
    readOnly: false,
    minimap: { enabled: false },
  };

  const generateCode = () => {
    let result: any[] = [];
    transaction.commandIndex.forEach((ele) => {
      if (ele === "Merge") {
        let sources = transaction.mergeState?.selected.map((ele, index) => {
          return {
            index,
            kind: "Input",
            value: ele.gasCoinId,
            type: "object",
          };
        });
        result.push({
          kind: "MergeCoins",
          destination: {
            index: 0,
            kind: "Input",
            value: transaction.mergeState?.receiver.gasCoinId,
            type: "object",
          },
          sources,
        });
      } else if (ele === "Split") {
        let amounts = transaction.splitState?.amounts.map((amount, index) => {
          return {
            index,
            kind: "Input",
            type: "pure",
            value: amount,
          };
        });
        result.push({
          kind: "SplitCoins",
          coin: {
            // not sure
            kind: "Input",
            value: "",
            type: "object",
          },
          amounts,
        });
      } else if (ele === "MoveCall") {
        let packageId = transaction.moveCallState?.packageId;
        let module = transaction.moveCallState?.module;
        let func = transaction.moveCallState?.funcs;
        let expectedInputs = transaction.moveCallState?.typeArgs.map((argsType) => {
          console.log(argsType);
          if (PRIMITIVES.includes(argsType)) {
            return argsType;
          } else {
            const [address, module, name] = argsType.split("::");
            return {
              MutableReference: {
                Struct: {
                  address,
                  module,
                  name,
                  typeArguments: [],
                },
              },
            };
          }
        });
        console.log(expectedInputs);
        result.push({
          kind: "MoveCall",
          target: `${packageId}::${module}::${func}`,
          index: 0,
          expectedInputs,
          typeParameters: {},
          inputs: [],
          outputs: [
            // {
            //   index: 0,
            //   MutableReference: {
            //     Struct: {
            //       address: "0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064",
            //       module: "counter",
            //       name: "Counter",
            //       typeArguments: [],
            //     },
            //   },
            // },
          ],
        });
      } else if (ele === "Transfer") {
        result.push({});
      }
    });
    setCode(ptbToCode(result));
  };

  return (
    <div className="h-[200vh] grow overflow-y-scroll">
      <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
        <div className="flex flex-col w-full items-start absolute top-[228px] left-0">
          <div className="flex-col gap-[16px]  self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
            <div
              className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
              onClick={handleNavigate}>
              <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                Simulation
              </div>
            </div>

            <div className="container mx-auto  p-3 rounded-lg flex flex-col gap-3">
              <h2 className="text-xl font-bold">Transaction: #{transaction.name}</h2>
              <div className="relative bg-gray-800 rounded-lg p-4">
                <CodeMirror
                  value={textarea}
                  options={{
                    mode: "shell",
                    theme: "material",
                    lineNumbers: false,
                    viewportMargin: Infinity,
                    style: { backgroundColor: "1F1F1F" },
                  }}
                  editorDidMount={(editor) => {
                    editorRef.current = editor;
                    editor.setSize("100%", "auto");
                  }}
                  className="my-codemirror w-full bg-gray-800"
                  // style={{ height: editorHeight }} // Apply dynamic height
                  onBeforeChange={(editor, data, value) => {
                    setTextarea(value);
                  }}
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-4h-2v4H8V6h4V4H8z" />
                    <path d="M10 2v2h6v10h2V4a2 2 0 00-2-2h-6z" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleRun()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Run
                </button>
                {/* <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                  Copy
                </button> */}
                <button
                  onClick={generateCode}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                  Gen
                </button>
              </div>
            </div>
            {code !== "" && (
              <Editor
                options={options}
                onChange={handleEditorChange}
                height="30vh"
                width="87vh"
                defaultLanguage="javascript"
                defaultValue={code}
                theme="vs-dark"
              />
            )}

            <div className="flex-1  h-[60px]">
              {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
              {isSuccess && (
                <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaction;
