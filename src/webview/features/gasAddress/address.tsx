import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../enums";
import styles from "./address.module.css";
import { useSuiClientContext } from "@mysten/dapp-kit";

export const Address = () => {
  // remember that then change UI in here need to call to terminal
  const { network } = useSuiClientContext();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const switchAddress = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.SWITCH_ADDRESS,
      address: e.target.value,
    });
    const { stdout, stderr } = resp;
    setCurrentAddress(e.target.value);
    console.log(stdout);
    setIsLoading(false);
  };

  useEffect(() => {
    async function getAddresses() {
      setIsLoading(true);
      const resp = await requestDataFromTerminal({
        cmd: SuiCommand.GET_ADDRESSES,
      });
      const { stdout, stderr } = resp;
      const objects = JSON.parse(stdout);
      const { activeAddress, addresses } = objects;
      setCurrentAddress(activeAddress);
      setAddresses(addresses);
      setIsLoading(false);
      // console.log(objects);
    }
    getAddresses();
  }, [network]);

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
          <select name="" id="" value={currentAddress} onChange={switchAddress}>
            {addresses.map((address, index) => {
              return (
                <option
                  className={`${
                    currentAddress && currentAddress === address[1]
                      ? styles["activeAddress"]
                      : ""
                  }`}
                >
                  {address[1]}
                </option>
              );
            })}
          </select>
        )}

        <div>
          <button>Create new address</button>
        </div>
      </Modal>
    </>
  );
};
