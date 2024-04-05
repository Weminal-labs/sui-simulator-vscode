import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../enums";
import { useSuiClientContext } from "@mysten/dapp-kit";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";

export interface GasObject {
  gasCoinId: string;
  suiBalance: number;
}

export const Gas = () => {
  // remember that then change UI in here need to call to terminal
  const { network } = useSuiClientContext();
  const { currentAddress, currentGasObject, gasObjects, setCurrentGasObject, setGasObjects } =
    useMySuiAccount();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const requestFaucet = () => {};

  useEffect(() => {
    async function getGasObjects() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_GAS_OBJECTS,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      setGasObjects(objects);
      setIsLoading(false);
      // console.log(objects);
    }
    getGasObjects();
  }, [network, currentAddress]);

  const balanceOfCurrentGasObject = gasObjects.find((gasObject) => gasObject.gasCoinId === currentGasObject)?.suiBalance;

  console.log(currentGasObject);

  return (
    <>
      <button onClick={openModal}>Gas objects</button>
      <span>The gas objects owned by the address</span>
      <span>{currentGasObject ? currentGasObject : ""}</span>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <select
            value={currentGasObject}
            onChange={(e) => setCurrentGasObject(e.target.value)}
          >
            <option selected>Choose gas object</option>
            {gasObjects.map((gasObject: GasObject, index) => {
              return <option>{gasObject.gasCoinId}</option>;
            })}
          </select>
        )}
        <span>{balanceOfCurrentGasObject}</span>

        <div>
          <button>Faucet</button>
        </div>
      </Modal>
    </>
  );
};
