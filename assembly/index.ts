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
    var k = 0;

    while (label.charAt(k) == this.label.charAt(k) && label.length > k) {
      k++;
    }

    return k - 1;
  }

  add(label: string, id: i32): void {
    // TODO sorting
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      var lcp = child.lcp(label);

      if (lcp > -1) {
        if (lcp == child.label.length - 1) {
          child.add(label.slice(lcp + 1), id);
          return;
        }

        var prefix = label.slice(0, lcp + 1);
        var newChild = new Node(prefix);
        child.label = child.label.slice(lcp + 1);
        newChild.children.push(new Node(label.slice(lcp + 1), id));
        newChild.children.push(child);
        this.children[i] = newChild;
        return;
      }
    }

    this.children.push(new Node(label, id));
  }
}

function stringifyNodes(node: Node, lvl: i32 = 0): string {
  let str = node.label + " " + lvl.toString() + " | ";

  for (let i = 0; i < node.children.length; i++) {
    str += stringifyNodes(node.children[i], lvl + 1);
  }

  return str;
}

export function create(): Node {
  return new Node("");
}

export function add(routes: Node, route: string, id: i32): void {
  routes.add(route, id);
}

export function match(routes: Node, url: string): i32 {
  for (let i = 0; i < routes.children.length; i++) {
    let child = routes.children[i];

    let lcp = child.lcp(url);

    if (lcp == url.length - 1) {
      return child.id;
    }

    if (lcp == child.label.length - 1) {
      return match(child, url.slice(lcp + 1));
    }

    // something in common, early return
    if (lcp > -1) {
      return -1;
    }
  }

  return -1;
}
