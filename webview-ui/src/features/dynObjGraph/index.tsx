import React, { useState } from "react";
import { useEffect } from "react";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { SuiClient } from "@mysten/sui.js/client";
import { useSuiClient } from "@mysten/dapp-kit";
import { MyNode, Tree } from "./tree";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../../icons/ArrowLeft";

const sigmaStyle = { height: "500px", width: "100%" ,backgroundColor:"white",color:"white"};

interface MyGraphInterface {
  suiClient: SuiClient;
  parentId: string;
}

const MyGraph = ({ suiClient, parentId }: MyGraphInterface) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    // Create the graph

    async function createGraph() {
      const graph = new MultiDirectedGraph();

      graph.addNode(parentId, { x: 0, y: 0, label: parentId, size: 20 });

      const tree = await create_dyn_tree(suiClient);
      tree.preOrderTraversal(tree.root as MyNode, graph);

      return graph;
    }

    createGraph()
      .then((graph) => {
        loadGraph(graph);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loadGraph]);

  return null;
};

// Sigma settings
const sigmaSettings = { allowInvalidContainer: true };

// Create the Component that listen to all events
const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    console.log("register events");
    // Register the events
    registerEvents({
      // node events
      clickNode: (event) => {
        window.open(`https://suiscan.xyz/testnet/object/${event.node}`, "_blank");
        // console.log(event, event.event, event.node, event.preventSigmaDefault);
      },
    });
  }, [registerEvents]);

  return null;
};

async function create_dyn_tree(suiClient: SuiClient) {
  const root = new MyNode({
    objectId: "0xe67586f62a2249e6b621cddae2c4a7088222801b0e54432dc26a2022054bea5a",
  });
  const tree = new Tree();
  tree.root = root;
  await recur_add_tree(suiClient, root, tree);
  return tree;
}

async function recur_add_tree(suiClient: SuiClient, currentNode: MyNode, tree: Tree) {
  const resp = await suiClient.getDynamicFields({
    parentId: currentNode.data.objectId,
  });

  if (resp.nextCursor === null) {
    return;
  }

  for (const child of resp.data) {
    let newNode = new MyNode(child);
    currentNode.add(newNode);

    await recur_add_tree(suiClient, newNode, tree);
  }
}

export default function DisplayGraph() {
  const [objectId,setObjectId] = useState<string>("")
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <div className="h-[200vh] grow overflow-y-scroll">
      <div className="absolute w-[800px] sidebar:w-[400px] h-[766px] top-[-178px] left-[25px]">
        <div className="flex flex-col w-full items-start gap-[36px] absolute top-[228px] left-0">
          <div
            className="flex items-end gap-[8px] relative self-stretch w-full flex-[0_0_auto]"
            onClick={handleNavigate}>
            <ArrowLeft className="!relative !w-[24px] !h-[24px]" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Aeonik-Regular',Helvetica] font-normal text-white text-[18px] text-center tracking-[0] leading-[21.6px] whitespace-nowrap uppercase">
              Objects Graph
            </div>
          </div>
          <input
          onChange={(e) => {
            setObjectId
          }}
          value={objectId}
          placeholder="Dynamic object Id"
          type="text"
          className="block w-full px-4 py-3 text-[#8f8f8f] text-[18px] border border-red-100 rounded-lg bg-[#0e0f0e]"></input>
    
          <SigmaContainer settings={sigmaSettings} style={sigmaStyle} graph={MultiDirectedGraph}>
            <MyGraph
              suiClient={suiClient}
              parentId="0xe67586f62a2249e6b621cddae2c4a7088222801b0e54432dc26a2022054bea5a"
            />
            <GraphEvents />
          </SigmaContainer>
        </div>
      </div>
    </div>
  );
}
