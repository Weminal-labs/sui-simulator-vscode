export const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {}
};

export const convertWindowsToUnixPath = (windowsPath: string) => {
  // Replace double backslashes with single backslashes
  let singleBackslashes = windowsPath.replace(/\\\\/g, "\\");
  // Replace backslashes with forward slashes
  let unixPath = singleBackslashes.replace(/\\/g, "/");
  // Remove the initial part of the path up to "Ubuntu"
  unixPath = unixPath.substring(unixPath.indexOf("Ubuntu") + "Ubuntu".length);
  return unixPath;
};
