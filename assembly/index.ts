class Node {
  id: i32;
  label: string;
  children: Map<string, Node> = new Map<string, Node>();

  constructor(label: string, id: i32 = -1) {
    this.label = label;
    this.id = id;
  }

  get charAt0(): string {
    return this.label.charAt(0);
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
    const charAt0 = label.charAt(0);

    if (this.children.has(charAt0)) {
      const child = this.children.get(charAt0);
      const lcp = child.lcp(label);
      const sliceI = lcp + 1;

      if (lcp == child.label.length - 1) {
        child.add(label.slice(sliceI), id);
        return;
      }

      const prefix = label.slice(0, sliceI);
        const parent = new Node(prefix);
        const sibling = new Node(label.slice(sliceI), id);

        child.label = child.label.slice(sliceI);

        parent.children.set(sibling.charAt0, sibling);
        parent.children.set(child.charAt0, child);

        //replace
        this.children.set(charAt0, parent);
        return;
    }

    this.children.set(charAt0, new Node(label, id));
  }

  toString(lvl: i32 = 0): string {
    let str = this.label + " " + lvl.toString() + " | ";

    let children = this.children.values();

    for (let i = 0; i < children.length; i++) {
      str += children[i].toString(lvl + 1);
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
  let node = routes;
  let value = url;

  while (true) {
    const charAt0 = value.charAt(0);

    if (node.children.has(charAt0)) {
      const child = node.children.get(charAt0);
      const lcp = child.lcp(value);

      // perfect match!
      if (lcp == value.length - 1) {
        return child.id;
      }

      // the child label is the prefix of value
      if (lcp == child.label.length - 1) {
        node = child;
        value = value.slice(lcp + 1);
      } else {
        // value and child.label shares some common prefix so no other child could be a match, exit
        return -1;
      }
    } else {
      return -1;
    }
  }
}
