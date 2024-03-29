import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { TerminalCommand } from "../../../enums";

export interface GasObject { gasCoinId: string, suiBalance: number };

export const Gas = () => {
  // remember that then change UI in here need to call to terminal
  const [gasObjects, setGasObjects] = useState([]);
  const [currentGasObject, setCurrentGasObject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const requestFaucet = () => {
    
  };

  useEffect(() => {
    async function getGasObjects() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal(TerminalCommand.GET_GAS_OBJECTS);
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      setGasObjects(objects);
      setIsLoading(false);
      console.log(objects);
    }
    getGasObjects();
  }, []);

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
          <div style={{ borderStyle: "solid" }}>
            {gasObjects.map((gasObject: GasObject, index) => {
              return (
                <div
                  key={index}
                >
                  <div>{gasObject.gasCoinId}</div>
                  <div>{gasObject.suiBalance}</div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <button>Faucet</button>
        </div>
      </Modal>
    </>
  );
};
