export enum NodeType {
  STATIC = 0,
  PARAM = 1,
}

export class Node {
  id: i32;
  label: string;
  key: i32;
  children: Map<number, Node> = new Map<number, Node>();
  params: Array<Node> = new Array<Node>(0);
  type: NodeType = NodeType.STATIC;
  paramKey: string = "";

  paramEndCharCode: i32 = 47 /* '/' */;

  constructor(label: string, id: i32 = -1) {
    this.id = id;
    this.label = label;
    this.key = label.charCodeAt(0);
  }

  setLabel(label: string): void {
    this.label = label;
    this.key = label.charCodeAt(0);
  }
}

// @inline
export function getLongestCommonPrefix(node: Node, label: string, offset: i32 = 0): i32 {
  let k = 0;

  while (
    label.charCodeAt(k + offset) == node.label.charCodeAt(k) &&
    label.length > k + offset
  ) {
    k++;
  }

  return k;
}

// debug utility
export function nodeToString(node: Node, lvl: i32 = 0): string {
  let str = node.label + " " + lvl.toString() + " | ";

  let children = node.children.values();

  for (let i = 0; i < children.length; i++) {

    str += nodeToString(children[i], lvl + 1);
  }

  for (let i = 0; i < node.params.length; i++) {
    str += nodeToString(node.params[i], lvl + 1);
  }

  return str;
}
