import { get } from "http";
import { convertWindowsToUnixPath, getFolderPathFromFilePath } from "../utils";

// Test the function with your example path

console.log(convertWindowsToUnixPath("/Users/apple/Documents/dev/suidev/CLOB/Deepbook/"));
console.log(
  convertWindowsToUnixPath(
    "\\\\wsl.localhost\\Ubuntu\\home\\asus\\Workspace\\Move-on-Sui\\vbi\\counter"
  )
);
console.log(
  convertWindowsToUnixPath(
    "\\\\wsl.localhost\\Ubuntu-20.04\\home\\asus\\Workspace\\Move-on-Sui\\vbi\\counter"
  )
);
console.log(
    convertWindowsToUnixPath(
        "\\\\wsl.localhost\\Ubuntu-22.04\\home\\gruhaha9\\target\\release"
    )
);

// console.log(getFolderPathFromFilePath("/Users/apple/Documents/dev/suidev/CLOB/Deepbook/Move.toml"));
// console.log(getFolderPathFromFilePath("/home/asus/Workspace/Move-on-Sui/vbi/counter/Move.toml"));
