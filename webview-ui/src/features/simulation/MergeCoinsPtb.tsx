import React, { useState } from "react";

const MergeCoinsPtb = () => {
  const [addReceiver, setAddReceiver] = useState('@')
  const objectList = [
    { name: "Object 1", value: 100, balance: 50 },
    { name: "Object 2", value: 200, balance: 100 },
  ];
  return (
    <div className="flex flex-col gap-10 mt-5 ml-5 w-full">
      <div className="flex-col w-full">
        <div>Commands</div>
        <button
          className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] mt-3 relative self-stretch w-[200px] flex-[0_0_auto] bg-white rounded-[8px]"
          onClick={() => {}}>
          <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Merge
          </div>
        </button>
      </div>
      <div className="flex gap-5 items-center">
        <div className="border border-red-100 w-[200px] p-4">
          <button>
Object Recerver
          </button>
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={addReceiver}
            onChange={(e) => {
              setAddReceiver(e.target.value);
            }}
            className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]"></input>
        </div>
      </div>
      <div className="flex  gap-5 items-center">
        <div className="border border-red-100  w-[200px] p-4">Object coin</div>
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
            onClick={() => {}}>
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-black text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
              ADD
            </div>
          </button>
        </div>
      </div>
      <div>
        <div>Object List</div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0e0f0e]">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-white text-left text-white text-sm leading-4 font-medium">Object name</th>
                <th className="px-6 py-3 border-b border-white text-left text-white text-sm leading-4 font-medium">Value</th>
                <th className="px-6 py-3 border-b border-white text-left text-white text-sm leading-4 font-medium">Balance</th>
                <th className="px-6 py-3 border-b border-white text-left text-white text-sm leading-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {objectList.map((obj, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 border-b border-white text-white">{obj.name}</td>
                  <td className="px-6 py-4 border-b border-white text-white">{obj.value}</td>
                  <td className="px-6 py-4 border-b border-white text-white">{obj.balance}</td>
                  <td className="px-6 py-4 border-b border-white text-white">
                    <button className="bg-white text-black px-3 py-1 rounded">Action</button>
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        <div></div>
      </div>
    </div>
  );
};

export default MergeCoinsPtb;
