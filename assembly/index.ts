class Node {
  id: i32;
  label: string;
  children: Array<Node> = new Array<Node>(0);

  constructor(label: string, id: i32 = -1) {
    this.label = label;
    this.id = id;
  }

  // Longest Common Prefix
  lcp(label: string): i32 {
    let k = 0;

    while (label.charAt(k) == this.label.charAt(k) && label.length > k) {
      k++;
    }

    return k - 1;
  }

  add(label: string, id: i32): void {
    // TODO sorting
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const lcp = child.lcp(label);

      if (lcp > -1) {
        const sliceI = lcp + 1;

        if (lcp == child.label.length - 1) {
          child.add(label.slice(sliceI), id);
          return;
        }

        const prefix = label.slice(0, sliceI);
        const parent = new Node(prefix);
        const sibling = new Node(label.slice(sliceI), id);

        child.label = child.label.slice(sliceI);

        parent.children.push(sibling);
        parent.children.push(child);

        //replace
        this.children[i] = parent;
        return;
      }
    }

    this.children.push(new Node(label, id));
  }

  toString(lvl: i32 = 0): string {
    let str = this.label + " " + lvl.toString() + " | ";

    for (let i = 0; i < this.children.length; i++) {
      str += this.children[i].toString(lvl + 1);
    }

    return str;
  }
}

export function create(): Node {
  return new Node("");
}

export function add(routes: Node, route: string, id: i32): void {
  routes.add(route, id);
}

export function match(routes: Node, url: string): i32 {
  let i = 0;
  let node = routes;
  let value = url;

  while (node.children.length > i) {
    const child = node.children[i++];

    const lcp = child.lcp(value);

    // perfect match!
    if (lcp == value.length - 1) {
      return child.id;
    }

    // the child label is the prefix of value
    if (lcp == child.label.length - 1) {
      node = child;
      i = 0;
      value = value.slice(lcp + 1);
    } else if (lcp > -1) {
       // value and child.label shares some common prefix so no other child could be a match, exit
      return -1;
    }
  }

  return -1;
}
