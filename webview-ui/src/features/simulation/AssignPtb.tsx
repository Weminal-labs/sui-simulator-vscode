import React, { useState } from "react";
import { useAssignContext } from "../../context/AssignPtbProvider";

export const AssignPtb = () => {
  const {
    assigns,
    name,
    value,
    setName,
    setValue,
    handleAddAssign,
    handleEditAssign,
    handleRemoveAssign,
  } = useAssignContext();

  if (assigns === null) {
    console.log("assigs is null");
  }

  return (
    <>
      <div className="flex flex-col gap-[10px] w-full shadow-md rounded-md p-4">
        <div className="font-bold text-[18px] ">Assign</div>
        <input
          type="text"
          className="w-full mr-2 border rounded-md px-4 py-2 text-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="w-full border rounded-md px-4 py-2 text-black"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] relative self-stretch w-full flex-[0_0_auto] bg-white rounded-[8px]"
          onClick={handleAddAssign }>
          <div className="relative w-fit text-black mt-[-1.00px] [font-family:'Aeonik-Medium',Helvetica] font-medium text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
            Add to list
          </div>
        </button>
      </div>
      <div className="container mx-auto mt-4">
        <div className="flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Assign list</h2>
          </div>
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Value</th>
                <th className="border p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {assigns?.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.value}</td>
                  <td className="border p-2 ">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 mr-20"
                      onClick={() => handleEditAssign(index)}>
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      onClick={() => handleRemoveAssign(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssignPtb;
