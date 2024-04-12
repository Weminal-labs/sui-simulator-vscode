import React, { useState } from "react";
import { createContext, useContext } from "react";

export type MySuiAliasContextType = {
    aliases: any[];
    alias: string;
    objectId: string;
    setAlias: React.Dispatch<React.SetStateAction<string>>;
    setObjectId: React.Dispatch<React.SetStateAction<string>>;
    handleAddAlias: () => void;
    handleDeleteAlias: (index: number) => void;
    handleSaveAliasesToWorkspace: () => void;
};

const MySuiAliasContext = createContext<MySuiAliasContextType | null>(null);

export const MySuiAliasProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
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

    const handleSaveAliasesToWorkspace = () => { };

    return (
        <MySuiAliasContext.Provider
            value={{
                aliases,
                alias,
                objectId,
                setAlias,
                setObjectId,
                handleAddAlias,
                handleDeleteAlias,
                handleSaveAliasesToWorkspace,
            }}
        >
            {children}
        </MySuiAliasContext.Provider>
    );
};

export const useMySuiAlias = () => {
    const context = useContext(MySuiAliasContext);
    if (context === undefined) {
        throw new Error(
            "useMySuiAlias must be used within a MySuiAliasProvider"
        );
    }
    return context as MySuiAliasContextType;
};
