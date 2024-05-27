export interface effects {
    messageVersion: string;
    status: {
      status: string;
    };
    executedEpoch: string;
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
      nonRefundableStorageFee: string;
    };
    modifiedAtVersions: {
      objectId: string;
      sequenceNumber: string;
    }[];
    transactionDigest: string;
    created: {
      owner: {
        AddressOwner: string;
      };
      reference: {
        objectId: string;
        version: number;
        digest: string;
      };
    }[];
    mutated: {
      owner: {
        AddressOwner: string;
      };
      reference: {
        objectId: string;
        version: number;
        digest: string;
      };
    }[];
    gasObject: {
      owner: {
        AddressOwner: string;
      };
      reference: {
        objectId: string;
        version: number;
        digest: string;
      };
    };
    dependencies: string[];
  }
