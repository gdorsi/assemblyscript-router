import { getLongestCommonPrefix, Node, NodeType } from "./node";

// @inline
function getNodeTypeFromCharCode(code: i32): NodeType {
  return code == 58 /*:*/ ? NodeType.PARAM : NodeType.STATIC;
}

// @inline
function indexOfParamStart(url: string, start: i32): i32 {
  let i = start;

  /*
    Char codes:
    ':': 58
  */
  while (i < url.length) {
    const charCode = url.charCodeAt(i);

    if (charCode == 58) {
      return i;
    }

    i++;
  }

  return i;
}

// @inline
function indexOfParamEnd(url: string, start: i32): i32 {
  let i = start;

  /*
    Char codes:
    '-': 45
    '.': 46
    '/': 47
  */
  while (i < url.length) {
    const charCode = url.charCodeAt(i);

    if (charCode == 45 || charCode == 46 || charCode == 47) {
      return i;
    }

    i++;
  }

  return i;
}

export function insert(root: Node, url: string, id: i32): void {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }

  let i = 1;
  let node = root;

  // look where to insert the new route
  while (true) {
    const key = url.charCodeAt(i);
    const type = getNodeTypeFromCharCode(key);

    if (type == NodeType.STATIC) {
      // no childs found with key, break
      if (!node.children.has(key)) {
        break;
      }

      const child = node.children.get(key);
      const lcp = getLongestCommonPrefix(child, url, i);

      // full match, continue
      if (lcp == child.label.length) {
        node = child;
        i += lcp;
        // prefix in common, create new parent and break
      } else {
        const prefix = url.slice(i, i + lcp);
        const parent = new Node(prefix);

        child.setLabel(child.label.slice(lcp));

        parent.children.set(child.key, child);

        //replace
        node.children.set(key, parent);
        node = parent;
        i += lcp;
        break;
      }
    } else if (type == NodeType.PARAM) {
      const name = url.slice(i, indexOfParamEnd(url, i));

      let childIndex = -1;

      // look for a param with the same label
      for (let j = 0; j < node.params.length && childIndex == -1; j++) {
        if (node.params[j].label == name) {
          childIndex = j;
        }
      }

      // found, continue
      if (childIndex > -1) {
        const child = node.params[childIndex];
        node = child;
        i += child.label.length;
        // not found, break
      } else {
        break;
      }
    }
  }

  // create the new nodes 
  while (i < url.length) {
    const key = url.charCodeAt(i);
    const current = getNodeTypeFromCharCode(key);

    switch (current) {
      case NodeType.STATIC: {
        const end = indexOfParamStart(url, i);
        const child = new Node(url.slice(i, end));

        node.children.set(child.key, child);
        node = child;
        i = end;
        break;
      }
      case NodeType.PARAM: {
        const end = indexOfParamEnd(url, i);
        const child = new Node(url.slice(i, end));
        child.type = NodeType.PARAM;
        child.paramEndCharCode = url.charCodeAt(end);
        child.paramKey = child.label.slice(1);

        // TODO sort
        node.params.push(child);
        node = child;
        i = end;
        break;
      }
    }
  }

  // TODO check how find-my-way handle duplicates
  // the last node is the route leaf
  node.id = id;
}
