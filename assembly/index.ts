class Node {
  id: i32;
  label: string;
  children: Map<string, Node> = new Map<string, Node>();

  constructor(label: string, id: i32 = -1) {
    this.label = label;
    this.id = id;
  }

  get key(): string {
    return this.label.charAt(0);
  }

  // Longest Common Prefix
  lcp(label: string): i32 {
    let k = 0;

    while (label.charAt(k) == this.label.charAt(k) && label.length > k) {
      k++;
    }

    return k;
  }

  add(label: string, id: i32): void {
    const key = label.charAt(0);

    if (this.children.has(key)) {
      const child = this.children.get(key);
      const lcp = child.lcp(label);

      if (lcp == child.label.length - 1) {
        child.add(label.slice(lcp), id);
        return;
      }

      const prefix = label.slice(0, lcp);
      const parent = new Node(prefix);
      const sibling = new Node(label.slice(lcp), id);

      child.label = child.label.slice(lcp);

      parent.children.set(sibling.key, sibling);
      parent.children.set(child.key, child);

      //replace
      this.children.set(key, parent);
      return;
    }

    this.children.set(key, new Node(label, id));
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
    const key = value.charAt(0);

    if (node.children.has(key)) {
      const child = node.children.get(key);
      const lcp = child.lcp(value);

      // perfect match!
      if (lcp == value.length) {
        return child.id;
      }

      // the child label is the prefix of value
      if (lcp == child.label.length) {
        node = child;
        value = value.slice(lcp);
      } else {
        // value and child.label shares some common prefix so no other child could be a match, exit
        return -1;
      }
    } else {
      return -1;
    }
  }
}
