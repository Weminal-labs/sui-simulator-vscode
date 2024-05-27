import React, { useState } from "react";
import { useEffect } from "react";
import Graph, { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { DynamicFieldInfo, SuiClient } from "@mysten/sui.js/client";
import { useSuiClient } from "@mysten/dapp-kit";
import { getRandomColor, getRandomInt } from "./utils";
import { MyNode, Tree } from "./tree";

const sigmaStyle = { height: "500px", width: "100%" };

interface MyGraphInterface {
  suiClient: SuiClient;
  parentId: string;
}

// result not as expected because of async will not have the same order as the input
async function recursiveDynamicObject(
  suiClient: SuiClient,
  dynamicObject: DynamicFieldInfo,
  graph: Graph
) {
  console.log(graph);
  const resp = await suiClient.getDynamicFields({
    parentId: dynamicObject.objectId,
  });
  // console.log(resp);

  if (resp.nextCursor === null) {
    return;
  }

  console.log(dynamicObject.objectId);
  console.log(resp);

  for (const child of resp.data) {
    graph.addNode(child.objectId, {
      x: getRandomInt(2, 5),
      y: getRandomInt(2, 5),
      size: 10,
      label: child.objectId,
      color: getRandomColor(),
    });
    if (resp.nextCursor !== null) {
      graph.addEdgeWithKey(getRandomInt(10, 20), dynamicObject.objectId, child.objectId, {
        label: getRandomInt(10, 20),
      });
    } else {
      return;
    }

    await recursiveDynamicObject(suiClient, child, graph);
  }
}

const MyGraph = ({ suiClient, parentId }: MyGraphInterface) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    // Create the graph

    async function createGraph() {
      const graph = new MultiDirectedGraph();

      graph.addNode(parentId, { x: 0, y: 0, label: parentId, size: 20 });

      const tree = await create_dyn_tree(suiClient)
      tree.preOrderTraversal(tree.root as MyNode, graph)
      console.log(graph)

      // const resp = await suiClient.getDynamicFields({
      //   parentId,
      // });

      // for (const dynamicObject of resp.data) {
      //   graph.addNode(dynamicObject.objectId, {
      //     x: getRandomInt(1, 2),
      //     y: getRandomInt(1, 2),
      //     size: 10,
      //     label: dynamicObject.name.value,
      //     color: getRandomColor(),
      //   });
      //   graph.addEdgeWithKey(getRandomInt(10, 20), parentId, dynamicObject.objectId, {
      //     label: getRandomInt(10, 20),
      //   });
      // }

      // const promises = [];
      // for (const dynamicObject of resp.data) {
      //   promises.push(recursiveDynamicObject(suiClient, dynamicObject, graph));
      // }
      // await Promise.all(promises);
      return graph;
    }

    // const graph = new MultiDirectedGraph();

    // graph.addNode(parentId, { x: 0, y: 0, label: parentId, size: 20 });
    // for (const dynamicObject of dynamicObjects) {
    //   console.log("Im here 1");
    //   graph.addNode(dynamicObject.objectId, {
    //     x: getRandomInt(1, 2),
    //     y: getRandomInt(1, 2),
    //     size: 10,
    //     label: dynamicObject.name.value,
    //     color: getRandomColor(),
    //   });
    //   graph.addEdgeWithKey(
    //     getRandomInt(10, 20),
    //     parentId,
    //     dynamicObject.objectId,
    //     { label: getRandomInt(10, 20) },
    //   );
    // }

    // graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
    // graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
    // graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
    // graph.addEdgeWithKey("rel2", "A", "B", { label: "REL_2" });
    createGraph()
      .then((graph) => {
        loadGraph(graph);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(graph);
    // loadGraph(graph);
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

async function fetchObject(suiClient: SuiClient, objectId: string) {
  const data = await suiClient.getObject({
    id: objectId,
  });
  // console.log(data);
  return data;
}

async function fetchDynamicFields(suiClient: SuiClient, objectId: string) {
  const resp = await suiClient.getDynamicFields({
    parentId: objectId,
  });
  return resp;
  // setDynamicObjects(resp.data);
  console.log(resp);
}

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
  const suiClient = useSuiClient();

  // async function fetchDynamicFields(parentId) {
  //   const resp = await suiClient.getDynamicFields({ parentId });

  //   if (resp.length === 0) {
  //     return [];
  //   }

  //   const childObjects = [];

  //   for (const child of resp) {
  //     const childResp = await fetchDynamicFields(child.id);
  //     childObjects.push({
  //       ...child,
  //       children: childResp,
  //     });
  //   }

  //   return childObjects;
  // }

  // const [dynamicObjects, setDynamicObjects] = useState<DynamicFieldInfo[]>([]);

  useEffect(() => {
    // fetchDynamicFields();
    // fetchObject();
  }, []);

  return (
    <SigmaContainer settings={sigmaSettings} style={sigmaStyle} graph={MultiDirectedGraph}>
      <MyGraph
        suiClient={suiClient}
        parentId="0xe67586f62a2249e6b621cddae2c4a7088222801b0e54432dc26a2022054bea5a"
      />
      <GraphEvents />
    </SigmaContainer>
  );
}
