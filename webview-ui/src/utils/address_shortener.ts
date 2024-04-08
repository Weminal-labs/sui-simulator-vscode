export function shortenAddress(address: string, truncateLength: number): string {
  const length = address.length - 2;
  if (length <= truncateLength) {
    return address;
  }
  return `0x${address.slice(2, 2 + truncateLength)}...${address.slice(
    length + 2 - truncateLength
  )}`;
}

export function shortenObjectType(objectType: string, truncateLength: number): string {
  const parts = objectType.split("::");

  const length = parts[0].length - 2;
  if (length <= truncateLength) {
    return `${parts[0]}::${parts[1]}::${parts[2]}`;
  }
  return `0x${parts[0].slice(2, 2 + truncateLength)}...${parts[0].slice(
    length + 2 - truncateLength
  )}::${parts[1]}::${parts[2]}`;
}
