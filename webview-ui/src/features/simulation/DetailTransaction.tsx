import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";

interface DetailParams {
  id: string;
}
// se sd useContext de lay transaction
const transactions = [
  { id: 1, name: "test_game_func", command: `sui client ptb \\ \n--assign A none` },
  { id: 2, name: "test_command", command: `sui client ptb \\ \n--assign to_add @0x123` },
];

const DetailTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const transaction = transactions.find((t) => t.id === parseInt(id));

  if (!transaction) {
    return <div> Transaction not found</div>;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.command);
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
            <div>Transaction Detail: </div>
            <div className="container mx-auto mt-10 p-6 rounded-lg">
              <h2 className="text-xl font-bold">Transaction: #{transaction.name}</h2>
              <textarea
                className="w-full mt-4 p-2 border rounded text-black"
                rows={10}
                value={transaction.command}
                readOnly
              />
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
