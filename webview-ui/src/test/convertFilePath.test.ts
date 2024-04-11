import { convertWindowsToUnixPath } from "../utils";

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
