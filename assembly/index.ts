class Node {
  id: i32;
  label: string;
  children: Array<Node> = new Array<Node>(0);

  constructor(label: string, id: i32 = -1) {
    this.label = label;
    this.id = id;
  }

  get charCodeAt0(): i32 {
    return this.label.charCodeAt(0);
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
    let start = 0;
    let end = this.children.length - 1;
    const charCodeAt0 = label.charCodeAt(0);

    // binary search
    while (start <= end) {
      const i: i32 = Math.floor((start + end) / 2) as i32;

      const child = this.children[i];

      if (child.charCodeAt0 == charCodeAt0) {
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

        if (sibling.charCodeAt0 < child.charCodeAt0) {
          parent.children.push(sibling);
          parent.children.push(child);
        } else {
          parent.children.push(child);
          parent.children.push(sibling);
        }

        //replace
        this.children[i] = parent;
        return;
      } else if (child.charCodeAt0 < charCodeAt0) {
        start = i + 1;
      } else {
        end = i - 1;
      }
    }

    this.children.push(new Node(label, id));

    let pos = this.children.length - 1;

    // places the new elment in the right position
    while (pos > end && pos > 0) {
      let temp = this.children[pos];
      this.children[pos] = this.children[pos - 1];
      this.children[pos - 1] = temp;
    }
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
  let node = routes;
  let value = url;

  let start = 0;
  let end = node.children.length - 1;

  // binary search
  while (start <= end) {
    const i: i32 = Math.floor((start + end) / 2) as i32;
    const charCodeAt0 = value.charCodeAt(0);

    const child = node.children[i];

    if (child.charCodeAt0 == charCodeAt0) {
      const lcp = child.lcp(value);

      // perfect match!
      if (lcp == value.length - 1) {
        return child.id;
      }

      // the child label is the prefix of value
      if (lcp == child.label.length - 1) {
        node = child;
        start = 0;
        end = node.children.length - 1;
        value = value.slice(lcp + 1);
      } else {
        // value and child.label shares some common prefix so no other child could be a match, exit
        return -1;
      }
    } else if (child.charCodeAt0 < charCodeAt0) {
      start = i + 1;
    } else {
      end = i - 1;
    }
  }

  return -1;
}
