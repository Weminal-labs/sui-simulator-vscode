import React from "react";
import { useNavigate } from "react-router-dom";
import { useAssignContext } from "../../context/AssignPtbProvider";

interface Transaction {
  id: number;
  name: string;
  command: string;
}

export const ListTransaction: React.FC = () => {
  const navigate = useNavigate();

  // se sd useContext de lay transaction

  const {
 
    // setTransactions,
    // transactions,
    state
    
  } = useAssignContext();
  const handleRowClick = (id: string) => {
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
            <th className="w-1/3 py-3 px-4 font-semibold text-sm">Status</th>

          </tr>
        </thead>
        <tbody className="text-white">
          {state.transactions.map((row,index) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              className="hover:bg-gray-800 cursor-pointer">
              <td className="w-1/3 py-3 px-4">{index+1}</td>
              <td className="w-1/3 py-3 px-4">{row.name}</td>
              <td className={`w-1/3 py-3 px-4 `}>
                <span className={`${row.active?"bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300":"bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"}`}>

                {row.active?"Active":"Done"}

                </span>
                </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
