import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { GasObject } from "../gasAddress/gas";
import { shortenAddress } from "../../utils/address_shortener";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import styles from "../gasAddress/address.module.css";
import { useAssignContext } from "../../context/AssignPtbProvider";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { Error } from "../../components/Error";
import Success from "../../components/Success";

const MergeCoinsPtb = () => {
  const { getObjectGas, gasObjects, setGasObjects } = useMySuiAccount();
  const [receiver, setReceiver] = useState<GasObject | null>(null);
  const [selected, setSelected] = useState<GasObject[]>([]);
  const [isShowMerged, setIsShowMerged] = useState(false);
  const { state, addMergeCommand } = useAssignContext();
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  async function getGasObjects() {
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.GET_GAS_OBJECTS,
    });
    const { stdout } = resp;
    const objects = JSON.parse(stdout);

    setGasObjects(objects);
  }
  useEffect(() => {
    const initData = async () => {
      getGasObjects();

      if (state.receiver !== null) {
        setReceiver(state.receiver);
      }
      if (state.selected !== null) {
        setSelected((prev) => {
          return [...prev, ...state.selected];
        });
      }
    };

    initData();
  }, []);

  const handleSelectedMerged = async (gasCoin: GasObject) => {
    setReceiver(gasCoin);
    setIsShowMerged(false);
  };

  const handledSelectObject = (object: GasObject, isChecked: boolean) => {
    setSelected((prevSelected) =>
      isChecked
        ? [...prevSelected, object]
        : prevSelected.filter((element) => element.gasCoinId !== object.gasCoinId)
    );
  };

  function convertSelectedToString(selected: GasObject[]): string {
    return selected.map((item) => `@${item.gasCoinId}`).join(",");
  }

  const handleSubmit = () => {
    if (selected.length === 0 || receiver === null) {
      setIsError(true);
      setIsSuccess(false);

      setError("Please! Fill your information");
      return;
    }
    const SelectObjectID = convertSelectedToString(selected);
    let result = `--merge-coins @${receiver?.gasCoinId} "[${SelectObjectID}]" \\\n`;
    addMergeCommand(result, receiver!, selected);
    setIsError(false);
    setIsSuccess(true);
    setSuccess("Add merrge command to PTB");

    setTimeout(() => {
      setIsSuccess(false);
      setSuccess("");
    }, 3000);
  };
  const checkIncludeTransfer = (id: string): Boolean => {
    return state.objectId.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  const checkInclude = (id: string): boolean => {
    return selected.find((ele) => {
      return ele.gasCoinId === id;
    })
      ? true
      : false;
  };
  return (
    <div className="flex flex-col gap-5 mt-5  w-full">
      <div className="flex gap-5 items-start ">
        <div className="border border-red-100 w-[200px] p-4 rounded-lg text-center  mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[18px] tracking-[0] leading-[21.6px] whitespace-nowrap">
          <div>Object Receiver</div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="relative block ">
            <div
              className="block w-full h-[54px] px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"
              onClick={() => setIsShowMerged(!isShowMerged)}>
              <span>{receiver ? shortenAddress(receiver.gasCoinId, 5) : "Choose gas object"}</span>
            </div>

            {isShowMerged && (
              <ul className="z-10 absolute block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-[#5a5a5a] rounded-lg bg-[#0e0f0e]">
                {gasObjects.map((gasObject: GasObject) => {
                  if (
                    !selected.includes(gasObject) &&
                    state.splitObject?.gasCoinId !== gasObject.gasCoinId &&
                    checkIncludeTransfer(gasObject.gasCoinId)===false
                  ) {
                    return (
                      <li
                        className="flex justify-between items-center"
                        onClick={() => handleSelectedMerged(gasObject)}
                        key={gasObject.gasCoinId}>
                        <span
                          className={`${
                            receiver && receiver.gasCoinId === gasObject.gasCoinId
                              ? styles["activeAddress"]
                              : ""
                          }`}>
                          {shortenAddress(gasObject.gasCoinId, 5)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(gasObject.gasCoinId);
                            setIsShowMerged(false);
                          }}>
                          Copy
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            )}
        
          </div>
          <p className="relative flex-1 mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-[#8f8f8f] text-[14px] tracking-[0] leading-[16.8px]">
              Gas Balance: {receiver ? +receiver.mistBalance : "0"}
            </p>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-[200px]">
          <button
            className="flex items-center justify-center gap-[10px] px-[23px] py-[16px] w-full bg-white rounded-[8px]"
            onClick={() => handleSubmit()}>
            <div className="text-black text-[18px] font-medium">Add Command</div>
          </button>
        </div>
        <div className="flex-1  h-[60px]">
          {isError && <Error errorMsg={error} closeError={() => setIsError(false)} />}
          {isSuccess && <Success successMsg={success} closeSuccess={() => setIsSuccess(false)} />}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className=" text-2xl text-white">Object List</div>
        <div className="overflow-x-auto border border-white rounded-lg">
          <table className="min-w-full bg-[#0e0f0e] text-xl">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-white text-left text-white">Object</th>
                <th className="px-6 py-3 border-b border-white text-left text-white">
                  Mist Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white">
                  Sui Balance
                </th>
                <th className="px-6 py-3 border-b border-white text-left text-white">Selected</th>
              </tr>
            </thead>
            <tbody>
              {gasObjects.map((obj: GasObject) => {
                if (
                  obj.gasCoinId !== receiver?.gasCoinId &&
                  state.splitObject?.gasCoinId !== obj.gasCoinId&&
                  checkIncludeTransfer(obj.gasCoinId)===false

                ) {
                  return (
                    <tr key={uuidv4()}>
                      <td className="px-6 py-4 ">
                        {shortenAddress(obj.gasCoinId, 5)}
                      </td>
                      <td className="px-6 py-4  ">
                        {obj.mistBalance.toString()}
                      </td>
                      <td className="px-6 py-4  ">
                        {obj.suiBalance}
                      </td>
                      <td className="px-6 py-4  ">
                        <input
                          checked={checkInclude(obj.gasCoinId)}
                          onChange={(e) => handledSelectObject(obj, e.target.checked)}
                          type="checkbox"
                          className="form-checkbox h-6 w-6 text-green-500 rounded-md border-2 border-green-500 focus:ring-green-500"
                        />
                      </td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MergeCoinsPtb;
