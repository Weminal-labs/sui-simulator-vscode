import { SuiMoveNormalizedType } from "@mysten/sui.js/client";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";

// import { formatInputLabel, parseResultArgument } from "./parser";
// import { NewTransactionType } from "./types";

const CLOCK_OBJECT_TYPE = "0x2::clock::Clock";
const STRING_OBJECT_TYPE = "0x1::string::String";
const ASCII_OBJECT_TYPE = "0x1::ascii::String";
const OBJECT_ID_TYPE = "0x2::object::ID";

interface NewTransactionType {
  kind: "MoveCall" | "TransferObjects"; // Indicates the type of transaction

  // For MoveCall transactions
  target: string; // Target of the move call
  typeParameters: Record<string, string>; // Type parameters for the transaction
  inputs: (string | { object: string })[]; // Expected inputs for the transaction
  expectedInputs: (string | SuiMoveNormalizedType)[]; // Expected inputs for the transaction
  outputs: any[]; // Expected outputs for the transaction
  index: number; // Index of the transaction

  // For TransferObjects transactions
  // [To be determined]
}

const df = 32;

function P1(e: any, t = ["<", ">"]) {
  const [n, r] = t,
    a = [];
  let i = "",
    o = 0;
  for (let s = 0; s < e.length; s++) {
    const l = e[s];
    if ((l === n && o++, l === r && o--, o === 0 && l === ",")) {
      a.push(i.trim()), (i = "");
      continue;
    }
    i += l;
  }
  return a.push(i.trim()), a;
}

function wF(e: any): any {
  return e.includes("::") ? ak(e) : e;
}

function en(e: any, t = !1) {
  let n = e.toLowerCase();
  return !t && n.startsWith("0x") && (n = n.slice(2)), `0x${n.padStart(df * 2, "0")}`;
}

function ak(e: any) {
  const [t, n] = e.split("::"),
    r = e.slice(t.length + n.length + 4),
    a = r.includes("<") ? r.slice(0, r.indexOf("<")) : r,
    i = r.includes("<")
      ? P1(r.slice(r.indexOf("<") + 1, r.lastIndexOf(">"))).map((o: any) => wF(o.trim()))
      : [];
  return {
    address: en(t),
    module: n,
    name: a,
    typeParams: i,
  };
}

function ik(e: any) {
  const { address: t, module: n, name: r, typeParams: a } = typeof e == "string" ? ak(e) : e,
    i =
      (a == null ? void 0 : a.length) > 0
        ? `<${a.map((o: any) => (typeof o == "string" ? o : ik(o))).join(",")}>`
        : "";
  return `${t}::${n}::${r}${i}`;
}

function Ay(e: any): any {
  return (
    e.Struct &&
      (Object.assign(e, {
        ...e.Struct,
      }),
      delete e.Struct),
    e.typeArguments &&
      (e.typeArguments.forEach((t: any) => Ay(t)),
      (e.typeParams = e.typeArguments),
      delete e.typeArguments),
    e.Vector && Ay(e.Vector),
    e
  );
}

function nb(e: any) {
  var t;
  if (typeof e == "object") {
    if ("Struct" in e) {
      const n = Ay({
        ...e,
      });
      let r = ik(n);
      return (
        ((t = n.typeParams) == null ? void 0 : t.length) > 0 &&
          n.typeParams.forEach((a: any, i: any) => {
            r.includes("undefined::undefined::undefined") &&
              (r = r.replace("undefined::undefined::undefined", `Type_${a.TypeParameter}`));
          }),
        r
      );
    }
    if ("TypeParameter" in e) return `Type_${e.TypeParameter}`;
  }
  return e;
}

function formatInputLabel(e: any): any {
  var t;
  if (typeof e == "object") {
    let n;
    if (
      ("Struct" in e &&
        (n = {
          by: "value",
          type: nb(e),
        }),
      "Reference" in e &&
        (n = {
          by: "ref",
          type: nb(e.Reference),
        }),
      "MutableReference" in e &&
        (n = {
          by: "mutRef",
          type: nb(e.MutableReference),
        }),
      "TypeParameter" in e &&
        (n = {
          by: "typeParam",
          type: `Type_${e.TypeParameter}`,
        }),
      "Vector" in e &&
        (n = {
          by: "vector",
          type: `vector<${(t = formatInputLabel(e.Vector)) == null ? void 0 : t.type}>`,
        }),
      "by" in e)
    )
      return e;
    if (n === void 0) throw new Error("Failed to parse object");
    return n;
  }
  return {
    by: "unset",
    type: e,
  };
}

function containsResultString(e: any): boolean {
  return typeof e === "string" && e.includes("Result");
}

function parseResultArgument(e: any) {
  if (!containsResultString(e)) return null;
  const t = JSON.parse(e);
  delete t.type; // remove type property
  return t;
}

const PRIMITIVE_PURE_ARGS: Record<string, string> = {
  Address: "txb.pure.address",
  U8: "txb.pure.u8",
  U16: "txb.pure.u16",
  U32: "txb.pure.u32",
  U64: "txb.pure.u64",
  U128: "txb.pure.u128",
  U256: "txb.pure.u256",
  Bool: "txb.pure.bool",
};

const PRIMITIVES = [
  "Bool",
  "U8",
  "U16",
  "U32",
  "U64",
  "U128",
  "U256",
  "Address",
  STRING_OBJECT_TYPE,
  ASCII_OBJECT_TYPE,
];

const PTB_LAYOUT = `const txb = new TransactionBlock();`;

const printObject = (struct: string | undefined, value?: string) => {
  return 'txb.object("' + (value ?? "") + '"),' + (!value ? ` // ${struct}` : "");
};

/**
 * Parses the type params out of the NewTransactionType.
 */
const getTypeParameters = (tx: NewTransactionType) => {
  return Object.keys(tx.typeParameters).length > 0
    ? `\n\t\ttypeArguments: ["${Object.values(tx.typeParameters)
        .map((_, index) => "Type_" + index)
        .join('", "')}"]`
    : "";
};

/**
 * Accepts a SuiMoveNormalizedType and converts into a string.
 * If input is not of "object" type, it throws an error.
 */
const getStructAsString = (input: SuiMoveNormalizedType) => {
  if (typeof input !== "object") throw new Error("Invalid input type");
  let struct = "";

  if ("Struct" in input) {
    struct = formatInputLabel(input).type;
  }
  if ("Reference" in input) {
    struct = formatInputLabel(input.Reference)?.type;
  }
  if ("MutableReference" in input) {
    struct = formatInputLabel(input.MutableReference)?.type;
  }

  if ("TypeParameter" in input) {
    struct = `Type_${input.TypeParameter}`;
  }
  if ("Vector" in input) {
    struct = `vector<${formatInputLabel(input.Vector)?.type.replace(/"/g, "")}>`;
  }

  return struct;
};

const isPrimitive = (input: SuiMoveNormalizedType) => {
  return typeof input === "string" && Object.hasOwn(PRIMITIVE_PURE_ARGS, input);
};

const prepareInputs = (tx: NewTransactionType) => {
  const inputs = [];

  let index = 0;
  for (const input of tx.expectedInputs) {
    const value = tx.inputs[index] || "";
    if (typeof input === "string" && isPrimitive(input as SuiMoveNormalizedType)) {
      const val = input === "Bool" ? value === "true" : `"${value}"`;
      inputs.push(`${PRIMITIVE_PURE_ARGS[input]}(${val}),`);
    }

    if (typeof input === "object") {
      // converts any Object, TypeParam, Reference, MutableReference, or Vector into a string
      let struct = getStructAsString(input as unknown as SuiMoveNormalizedType);

      if (struct === CLOCK_OBJECT_TYPE) {
        inputs.push(printObject(undefined, SUI_CLOCK_OBJECT_ID));
      } else if (struct === STRING_OBJECT_TYPE || struct === ASCII_OBJECT_TYPE) {
        inputs.push(`txb.pure.string("${value}"),`);
      } else if (struct === OBJECT_ID_TYPE) {
        inputs.push(`txb.pure.id("${value}"), // ${struct}`);
      } else if (struct?.startsWith("vector<")) {
        let isPure = false;
        for (const primitive of PRIMITIVES) {
          if (struct.includes(primitive)) {
            isPure = true;
            break;
          }
        }
        if (isPure) {
          inputs.push(
            "txb.pure([" + (value.object ?? "") + "])," + (!value.object ? ` // ${struct}` : "")
          );
        } else {
          inputs.push(printObject(struct, value.object));
        }
      } else {
        inputs.push(printObject(struct, value.object));
      }
    }
    index++;
  }

  // for (const [index, input] of tx.expectedInputs.entries()) {
  //   const value = tx.inputs[index] || "";
  //   if (typeof input === "string" && isPrimitive(input as SuiMoveNormalizedType)) {
  //     const val = input === "Bool" ? value === "true" : `"${value}"`;
  //     inputs.push(`${PRIMITIVE_PURE_ARGS[input]}(${val}),`);
  //   }

  //   if (typeof input === "object") {
  //     // converts any Object, TypeParam, Reference, MutableReference, or Vector into a string
  //     let struct = getStructAsString(input as unknown as SuiMoveNormalizedType);

  //     if (struct === CLOCK_OBJECT_TYPE) {
  //       inputs.push(printObject(undefined, SUI_CLOCK_OBJECT_ID));
  //     } else if (struct === STRING_OBJECT_TYPE || struct === ASCII_OBJECT_TYPE) {
  //       inputs.push(`txb.pure.string("${value}"),`);
  //     } else if (struct === OBJECT_ID_TYPE) {
  //       inputs.push(`txb.pure.id("${value}"), // ${struct}`);
  //     } else if (struct?.startsWith("vector<")) {
  //       let isPure = false;
  //       for (const primitive of PRIMITIVES) {
  //         if (struct.includes(primitive)) {
  //           isPure = true;
  //           break;
  //         }
  //       }
  //       if (isPure) {
  //         // inputs.push(
  //         //   "txb.pure([" + (value.object ?? "") + "])," + (!value.object ? ` // ${struct}` : "")
  //         // );
  //       } else {
  //         // inputs.push(printObject(struct, value.object));
  //       }
  //     } else {
  //       // inputs.push(printObject(struct, value.object));
  //     }
  //   }
  // }

  const inputString = inputs.map((x) => `\t\t\t\t${x}`).join("\n");

  if (inputs.length > 0) {
    return `\n\t\targuments: [\n${inputString}\n\t\t],`;
  }
  return "";
};

const prepareAssignment = (tx: NewTransactionType) => {
  const hasMultipleOutputs = tx.outputs.length > 1;

  const formatResult = (index: number) => {
    if (!hasMultipleOutputs) return `result_${tx.index}`;
    return `result_${tx.index}_${index}`;
  };

  let outputs = tx.outputs.map((_, index) => formatResult(index)).join(", ");

  if (hasMultipleOutputs) outputs = `[${outputs}]`;

  if (tx.outputs.length > 0) {
    const comments = `// Result types: [${tx.outputs
      .map((x) => `${formatInputLabel(x)?.type}`)
      .join(", ")}]\n`;
    return `${comments}const ${outputs} = `;
  }
  return "";
};

const ptbMoveCall = (tx: NewTransactionType) => {
  return `\n${prepareAssignment(tx)}txb.moveCall({
\t\ttarget: "${tx.target}",${prepareInputs(tx)}${getTypeParameters(tx)}
});`;
};

// WIP.
const ptbTransferObjects = (tx: NewTransactionType) => {
  return `\ntxb.transferObjects([${tx.inputs
    .slice(1)
    .filter((x) => !!x)
    .map((x) => `"${parseResultArgument(x) || formatInputLabel(x)}"`)}], txb.pure.address("${
    tx.inputs[0] || "Fill in the address"
  }"))`;
};

const ptbSplitCoins = (tx: any) => {
  return `\nconst [${tx.amounts.map(
    (x: any, index: any) => `coin${index}`
  )}] = txb.splitCoins(txb.gas, [${tx.amounts.map((x: any) => `txb.pure(${x.value})`)}]);`;
};

const ptbMergeCoins = (tx: any) => {
  return `\ntxb.mergeCoins("${tx.destination.value}", [${tx.sources.map(
    (x: any) => `txb.object("${x.value}")`
  )}]);`;
};

export const ptbToCode = (transactions: any[]) => {
  const code = transactions
    .map((tx) => {
      if (tx.kind === "MoveCall") return ptbMoveCall(tx);
      if (tx.kind === "TransferObjects") return ptbTransferObjects(tx);
      if (tx.kind === "SplitCoins") return ptbSplitCoins(tx);
      if (tx.kind === "MergeCoins") return ptbMergeCoins(tx);
      return [];
    })
    .join("\n");

  return `${PTB_LAYOUT}\n${code}`;
};

const splitCoin = {
  kind: "SplitCoins",
  coin: {
    // not sure
    kind: "Input",
    value: "",
    type: "object",
  },
  amounts: [
    {
      index: 0,
      kind: "Input",
      type: "pure",
      value: 100,
    },
    {
      index: 0,
      kind: "Input",
      type: "pure",
      value: 200,
    },
  ],
};

const k6 = {
  kind: "MoveCall",
  target: "0x2::test::call",
  index: 0,
  typeParameters: {
    T: "0x1::string::String",
  },
  expectedInputs: [
    "U64",
    {
      MutableReference: {
        Struct: {
          address: "0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064",
          module: "counter",
          name: "Counter",
          typeArguments: [],
        },
      },
    },
  ],
  inputs: [],
  outputs: [
    {
      index: 0,
      MutableReference: {
        Struct: {
          address: "0xcab68c8cd7e80f3dd06466da6b2c083d1fd50ab3e9be8e32395c19b53021c064",
          module: "counter",
          name: "Counter",
          typeArguments: [],
        },
      },
    },
  ],
} as NewTransactionType;

const mergeCoins = {
  kind: "MergeCoins",
  destination: {
    index: 0,
    kind: "Input",
    value: "0x246e44c6f412b8f69475d4b6d64a51c58eec4896d0d0b24e55a63f74e0f34327",
    type: "object",
  },
  sources: [
    {
      index: 0,
      kind: "Input",
      value: "0x59f58742fcdc02b9b74a4f3e898f6feb48dc3ab08aa6633c0f6ba32731440b8f",
      type: "object",
    },
    {
      index: 1,
      kind: "Input",
      value: "0xf29f35a20e28334e429898e884a61ccdefc7c112814c41f699654906f7c8989a",
      type: "object",
    },
  ],
};

console.log(ptbToCode([mergeCoins, splitCoin, k6]));
