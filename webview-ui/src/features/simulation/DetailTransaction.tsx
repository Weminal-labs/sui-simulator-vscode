import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useAssignContext } from "../../context/AssignPtbProvider";

import { Controlled as CodeMirror } from "react-codemirror2";

// Import Codemirror styles and modes
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/shell/shell.js";
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
  const {
 
    // setTransactions,
    // transactions,
    state
    
  } = useAssignContext();
  const transaction =state.transactions.find((t) => t.id === id);

  const [textarea, setTextarea] = useState<string>(transaction?.command || "");
  const [editorHeight, setEditorHeight] = useState("auto");
  const editorRef = useRef<any>(null);
    // useEffect(() => {
    //   if (editorRef.current) {
    //       const doc = editorRef.current.editor;
    //     const lineCount = doc.lineCount();
    //     const lineHeight = 24; // Assume 24px per line height
    //     const newHeight = lineCount * lineHeight + 50; // Adjust height with padding
    //     editorRef.current.editor.setSize("100%", newHeight);
    //   }
    // }, [textarea]);
  if (!transaction) {
    return <div> Transaction not found</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(textarea);
  };

  const handleNavigate = () => {
    navigate("/simulation");
  };
  const handleRun = () => {
    console.log(transaction.command);
  };
  return (
    <div className="h-[200vh] grow overflow-y-scroll">
      <div className="absolute w-[640px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
        <div className="flex flex-col w-full items-start gap-[64px] absolute top-[228px] left-0">
          <div className="flex-col gap-[40px] p-[24px] self-stretch w-full flex-[0_0_auto] rounded-[16px] flex items-start relative">
            <div
              className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
              onClick={handleNavigate}>
              <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
              <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
                Simulation
              </div>
            </div>
            {/* Transaction Detail */}
            <div className="text-lg front-bold ">Transaction Detail: </div>
            <div className="container mx-auto mt-10 p-6 rounded-lg">
              <h2 className="text-xl font-bold">Transaction: #{transaction.name}</h2>
              <div className="relative bg-gray-800 rounded-lg p-4">
                <CodeMirror
                  value={textarea}
                  options={{
                    mode: "shell",
                    theme:"material",
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
                  onClick={handleRun}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                  Run
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTransaction;
