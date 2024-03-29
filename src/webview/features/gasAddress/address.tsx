import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { TerminalCommand } from "../../../enums";
import styles from "./address.module.css";

export const Address = () => {
  // remember that then change UI in here need to call to terminal
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    async function getAddresses() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal(TerminalCommand.GET_ADDRESSES);
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      const { activeAddress, addresses } = objects;
      setCurrentAddress(activeAddress);
      setAddresses(addresses);
      setIsLoading(false);
      console.log(objects);
    }
    getAddresses();
  }, []);

  return (
    <>
      <button onClick={openModal}>Addresses</button>
      <span>the Addresses managed by the client</span>
      <span>{currentAddress ? currentAddress : ""}</span>
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
            {addresses.map((address, index) => {
              return (
                <div
                  className={`${
                    (currentAddress && currentAddress === address[1]) ? styles["activeAddress"] : ""
                  }`}
                  key={index}
                >
                  <div>Alias: {address[0]}</div>
                  <div>Address: {address[1]}</div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <button>Create new address</button>
        </div>
      </Modal>
    </>
  );
};
