export const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {}
};

export function convertWindowsToUnixPath(filePath: string) {
  // Replace backslashes with forward slashes
  filePath = filePath.replace(/\\/g, "/");

  // Check if it's a WSL path
  if (filePath.startsWith("//wsl.localhost/")) {
    // Remove the prefix "//wsl.localhost/"
    filePath = filePath.replace(/^\/\/wsl\.localhost\//, "");

    // Remove any version number after "Ubuntu"
    filePath = filePath.replace(/^Ubuntu(-\d+\.\d+)?\//, "");

    // Replace all backslashes with forward slashes
    filePath = filePath.replace(/\\/g, "/");
  }

  // Ensure that the path after "home" has forward slashes
  filePath = filePath.replace(/^([^/]+)\//, "/$1/");

  return filePath;
}

export function getFolderPathFromFilePath(filePath: string) {
  return filePath.replace(/\/[^/]+$/, "");
}
