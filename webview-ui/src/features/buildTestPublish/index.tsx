import React, { useState } from "react";
import Collapsible from "react-collapsible";
import { useMySuiAccount } from "../../context/MySuiAccountProvider";
import { requestDataFromTerminal } from "../../utils/wv_communicate_ext";
import { SuiCommand } from "../../../../src/enums";
import Modal from "react-modal";

export const BuildTestPublish = () => {
  const { currentAddress, currentGasObject } = useMySuiAccount();
  const [gasBudget, setGasBudget] = useState<number>(100000000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDigest, setCurrentDigest] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [objects, setObjects] = useState<any[]>([]); // set type later

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handlePublish = async () => {
    setIsLoading(true);
    const resp = await requestDataFromTerminal({
      cmd: SuiCommand.PUBLISH_PACKAGE,
      gasBudget,
      gasObjectId: currentGasObject,
    });
    console.log(resp);

    const { stdout, stderr } = resp;
    // need to handle error case

    if (stderr.isError) {
      setError(stderr.message);
      setIsError(true);
      setIsLoading(false);
    } else {
      const { digest, objectChanges } = JSON.parse(stdout);
      setCurrentDigest(digest);
      console.log(digest);
      console.log(objectChanges);
      setIsLoading(false);
      setObjects(objectChanges);
    }
  };

  // const packageId = objects.find((obj) => obj.type === "published")?.packageId;
  // const modules = objects.map(obj => {
  //   const { objectId, objectType, type } = obj;
  //   if (type !== "published") {
  //     let moduleName = objectType
  //     return
  //   }
  // });

  const packages = objects
    .map((obj) => {
      if (obj.type !== "published") {
        const packageName = obj.objectType.split("::")[0];
        return packageName;
      }
    })
    .filter((item) => item !== undefined);

  let uniquePackages = [...new Set(packages)];

  uniquePackages = uniquePackages.map((pkg) => {
    return {
      packageName: pkg,
      modules: [],
    };
  });

  const getModulesOfPackage = (packageName: string) => {
    console.log(packageName);
    const modules = objects
      .map((obj) => {
        const { objectType, type } = obj;
        if (type !== "published") {
          console.log(objectType);
          if (objectType.startsWith(packageName)) {
            console.log(objectType.split("::"));
            return objectType.split("::")[1];
          }
        }
      })
      .filter((item) => item !== undefined);
    const uniqueModules = [...new Set(modules)];
    console.log(uniqueModules);
    return uniqueModules;
  };

  const getObjectsOfModule = (packageName: string, moduleName: string) => {
    const objectOfModule = objects
      .map((obj) => {
        if (obj.type !== "published") {
          if (
            obj.objectType.startsWith(packageName) &&
            obj.objectType.split("::")[1] === moduleName
          ) {
            return obj;
          }
        }
      })
      .filter((item) => item !== undefined);
    return objectOfModule;
  };

  return (
    <>
      <Collapsible trigger="Build, Test and Publish">
        <div>
          <div>
            <button>Build</button>
          </div>
          <div>
            <button>Test</button>
          </div>
          <span>Output:</span>
        </div>
        <div>
          <div>
            <button onClick={handlePublish}>Publish</button>
          </div>
          <input
            type="number"
            value={gasBudget}
            onChange={(e) => setGasBudget(Number(e.target.value))}
          />
          <span>Publisher {currentAddress}</span>
          <span>Gas Object {currentGasObject}</span>
        </div>
        <div>
          {isLoading ? (
            "Publishing...."
          ) : (
            <>
              {isError && <div>Error {error}</div>}
              {!isError && (
                <>
                  <div onClick={openModal}>Transaction: {currentDigest}</div>
                  <div>Error</div>
                  <Modal
                    ariaHideApp={false}
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                  >
                    <button onClick={closeModal}>close</button>
                    <h2>Effects:</h2>
                    {/* <span>Package id: {packageId}</span> */}

                    {uniquePackages.map((pkg) => {
                      return (
                        <>
                          <div>
                            <div>Package: {pkg.packageName}</div>
                            {getModulesOfPackage(pkg.packageName).map(
                              (module) => {
                                return (
                                  <div>
                                    <div>Module: {module}</div>
                                    {getObjectsOfModule(
                                      pkg.packageName,
                                      module
                                    ).map((obj) => {
                                      return (
                                        <div>
                                          <div>Object id: {obj.objectId}</div>
                                          <div>
                                            Object type: {obj.objectType}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </>
                      );
                    })}

                    {/* {objects.map((obj) => {
                      if (obj.type !== "published") {
                        return (
                          <>
                            <div>
                              <div>Object id: {obj.objectId}</div>
                              <div>Object type: {obj.objectType}</div>
                            </div>
                          </>
                        );
                      }
                    })} */}
                  </Modal>
                </>
              )}
            </>
          )}
        </div>
      </Collapsible>
    </>
  );
};
