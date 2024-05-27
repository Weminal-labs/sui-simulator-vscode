import React, { useState } from "react";
import { ArrowLeft } from "../../icons/ArrowLeft";
import { useNavigate } from "react-router-dom";
import styles from "./feSimulation.module.css";
import { Editor, Monaco } from "@monaco-editor/react";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export default function index() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleNavigate = () => {
    navigate("/");
  };

  const handleExecute = () => {
    evalWithTryCatch("console.log('Executed')");
    evalWithTryCatch(code);
  };

  function handleEditorChange(value, event) {
    // here is the current value
    console.log(value);
    setCode(value);
  }

  function handleEditorDidMount(editor, monaco) {
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
  }

  function handleEditorWillMount(monaco) {
    console.log("beforeMount: the monaco instance:", monaco);
  }

  function handleEditorValidation(markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  function evalWithTryCatch(codeString) {
    try {
      const result = eval(codeString);
      return result;
    } catch (error) {
      console.error("Error during evaluation:", error);
      // Handle the error here (e.g., display a message to the user)
      return null; // Or any default value
    }
  }
  const options = {
    readOnly: false,
    minimap: { enabled: false },
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
                Back
              </div>
            </div>
            <Editor
              options={options}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              beforeMount={handleEditorWillMount}
              onValidate={handleEditorValidation}
              height="40vh"
              width="100vh"
              defaultLanguage="javascript"
              defaultValue={`const txb = new TransactionBlock();

txb.mergeCoins("0x246e44c6f412b8f69475d4b6d64a51c58eec4896d0d0b24e55a63f74e0f34327", [txb.object("0x59f58742fcdc02b9b74a4f3e898f6feb48dc3ab08aa6633c0f6ba32731440b8f"),txb.object("0xf29f35a20e28334e429898e884a61ccdefc7c112814c41f699654906f7c8989a")]);

const [coin0,coin1] = txb.splitCoins(txb.gas, [txb.pure(100),txb.pure(200)]);

// Result types: [0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064::counter::Counter]
const result_0 = txb.moveCall({
	target: "0x2::test::call",
	arguments: [
		txb.pure.u64(""),
		txb.object(""), // 0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064::counter::Counter
	],
	typeArguments: ["Type_0"]
});`}
            />
            ;
          </div>
          <button onClick={handleExecute}>Execute</button>
        </div>
      </div>
    </div>
  );
}
