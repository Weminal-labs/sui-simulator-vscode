import React, { useState } from "react";

const MoveCallPtb: React.FC = () => {
  const [packageId, setPackageId] = useState<string>("");
  const [module, setModule] = useState<string>("");
  const [func, setFunc] = useState<string>("");
  const [args, setArgs] = useState<string[]>([]);

  const handleSubmit = () => {
    const AssignPKG = `--assign PKG ${packageId} \\\n`; 
    const args_list = args.map((item) => item);
    
    const command = `--move-call ${packageId}::${module}::${func} ${args_list.join(" ")} \\\n `;
    console.log(command);
  };

  const increaseAmountElement = () => {
    setArgs((prev) => [...prev, ""]);
  };
  const removeElementAtIndex = (index: number) => {
    setArgs((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="flex flex-col gap-7 mt-5 w-full">
      <div className="flex flex-col ">
        <label className="block mb-2 text-lg font-medium">Package ID</label>
        <div className="relative block flex-1">
          <input
            type="text"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
          />
        </div>
      </div>

      <div className="flex flex-col ">
        <label className="mb-2 text-lg font-medium text-white">Module</label>
        <div className="relative block flex-1">
          <input
            type="text"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
          />
        </div>
      </div>

      <div className="flex flex-col ">
        <label className="mb-2 text-lg font-medium text-white">Function</label>
        <input
          type="text"
          value={func}
          onChange={(e) => setFunc(e.target.value)}
          className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
        />
      </div>
      <div className="flex flex-col ">
        <label className="block mb-2 text-lg font-medium">Args</label>
        {args.map((arg, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              key={index}
              type="text"
              value={arg}
              onChange={(e) => {
                const newArgs = [...args];
                newArgs[index] = e.target.value;
                setArgs(newArgs);
              }}
              className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"
            />
            <button
              className="bg-red-500 text-white font-bold px-3 rounded text-2xl w-[40px] h-[40px] flex self-center"
              onClick={() => removeElementAtIndex(index)}>
              -
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center ">
        <button
          className="bg-blue-500 text-white font-bold px-3 rounded text-2xl w-[40px] h-[40px] flex self-center "
          onClick={increaseAmountElement}>
          +
        </button>
      </div>

      <div className="flex flex-col">
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              Add Command
            </div>
          </button>
        </div>
        {/* <div className="flex-1  h-[60px] ">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div> */}
      </div>
    </div>
  );
};

export default MoveCallPtb;
