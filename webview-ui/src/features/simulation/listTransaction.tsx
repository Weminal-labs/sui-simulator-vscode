import React from "react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: number;
  name: string;
  command: string;
}

export const ListTransaction: React.FC = () => {
  const navigate = useNavigate();

  // se sd useContext de lay transaction
  const transactions: Transaction[] = [
    { id: 1, name: "test_game_func", command: `sui client ptb \\ \n--assign A none` },
    { id: 2, name: "test_command", command: `sui client ptb \\ \n--assign to_add @0x123` }
  ];

  const handleRowClick = (id: number) => {
    navigate(`/detail-transaction/${id}`);
    console.log("detail transaction: " + id);
  };
  const handleClickTransaction = () => {
    console.log("handleClickTransaction");
  };

  return (
    <div className="container mx-auto mt-10">
      <table className="text-center min-w-full ">
        <thead className="text-white border border-solid border-white">
          <tr>
            <th className="w-1/3 py-3 px-4 font-semibold text-sm">Number</th>
            <th className="w-1/3 py-3 px-4 font-semibold text-sm">Name</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {transactions.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              className="hover:bg-gray-800 cursor-pointer">
              <td className="w-1/3 py-3 px-4">{row.id}</td>
              <td className="w-1/3 py-3 px-4">{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
