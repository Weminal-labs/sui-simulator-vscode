import { getRandomColor, getRandomInt } from "./utils";

export class MyNode {
  data: any;
  children: any[];

  constructor(data: any) {
    this.data = data;
    this.children = [];
  }

  add(node: MyNode) {
    this.children.push(node);
  }

  remove(data: any) {
    this.children = this.children.filter((node: { data: any }) => {
      return node.data !== data;
    });
  }
}

export class Tree {
  root: MyNode | null;

  constructor() {
    this.root = null;
  }

  preOrderTraversal(node: MyNode, graph: any) {
    if (node.children.length) {
      for (let child of node.children) {
        if (child.data.objectId) {
          graph.addNode(child.data.objectId, {
            x: getRandomInt(0, 10),
            y: getRandomInt(0, 10),
            size: 10,
            label: child.data.objectId,
            color: getRandomColor(),
          });
          graph.addEdgeWithKey(getRandomInt(10, 1000), node.data.objectId, child.data.objectId, {
            label: getRandomInt(10, 1000),
          });
        }
        this.preOrderTraversal(child, graph);
      }
    }
  }
}
