import { SuiClient } from "@mysten/sui.js/client";

export const getDetailPackage = async (
  suiClient: SuiClient,
  packageId: string
) => {
  try {
    const data = await suiClient.getNormalizedMoveModulesByPackage({
      package: packageId,
    });
    return data;
  } catch (err) {}
};
