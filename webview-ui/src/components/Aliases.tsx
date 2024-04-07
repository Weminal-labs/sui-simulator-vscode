import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { AliasList } from "./AliasList";
import { AliasItem } from "./AliasItem";

export const Aliases = () => {
  const [aliases, setAliases] = useState<any[]>([]);
  const [alias, setAlias] = useState<string>("");
  const [objectId, setObjectId] = useState<string>("");

  const handleAddAlias = () => {
    setAliases([
      ...aliases,
      {
        alias,
        objectId,
      },
    ]);
    setAlias("");
    setObjectId("");
  };

  const handleDeleteAlias = (index: number) => {
    setAliases((prevAliases) => prevAliases.filter((_, i) => i !== index));
  };

  const handleSaveAliasesToWorkspace = () => {
    
  };

  return (
    <>
      <h1>Aliases</h1>
      <Input placeholder="alias" value={alias} onChange={(e) => setAlias(e.target.value)} />
      <Input placeholder="object id" value={objectId} onChange={(e) => setObjectId(e.target.value)} />
      <Button onClick={handleAddAlias}>
        Add alias
      </Button>
      
      <AliasList >
        {aliases.map((ele, index) => {
            return (
              <AliasItem aliasItem={ele} handleDeleteAlias={handleDeleteAlias} index={index} />
            );
          })}
      </AliasList>

      <Button onClick={handleSaveAliasesToWorkspace}>
        Save Aliases to Workspace
      </Button>
    </>
  );
};
