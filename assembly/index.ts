enum NodeType {
  STATIC = 0,
  PARAM = 1,
}

class Node {
  id: i32;
  label: string;
  children: Map<number, Node>;
  params: Array<Node>;
  type: NodeType;
  paramKey: string = "";
  /*
    Char codes:
      '/': 47
  */
  paramEndCharCode: i32 = 47;

  constructor(label: string, id: i32 = -1) {
    /*
      Char codes:
        ':': 58
    */
    const type =
      label.charCodeAt(0) == 58 /*:*/ ? NodeType.PARAM : NodeType.STATIC;

    this.params = new Array<Node>(0);
    this.children = new Map<number, Node>();

    this.label = label;
    this.id = id;
    this.type = type;

    if (type === NodeType.STATIC) {
      const i = label.indexOf(":");

      if (i !== -1) {
        const child = new Node(label.slice(i), id);

        this.params.push(child);

        this.label = label.slice(0, i);
        this.id = -1;
      }
    } else if (type === NodeType.PARAM) {
      this.parseParam();
    }
  }

  get key(): i32 {
    return this.label.charCodeAt(0);
  }

  parseParam(): void {
    let i = 0;

    /*
      Char codes:
        '-': 45
        '.': 46
        '/': 47
    */
    while (i < this.label.length) {
      const charCode = this.label.charCodeAt(i);

      if (charCode == 45 || charCode == 46 || charCode == 47) {
        this.paramEndCharCode = this.label.charCodeAt(i);

        const child = new Node(this.label.slice(i), this.id);

        this.children.set(child.key, child);

        this.label = this.label.slice(0, i);
        this.id = -1;
        break;
      }

      i++;
    }

    this.paramKey = this.label.slice(1);
  }

  // Longest Common Prefix
  lcp(label: string, offset: i32 = 0): i32 {
    let k = 0;

    while (
      label.charCodeAt(k + offset) == this.label.charCodeAt(k) &&
      label.length > k + offset
    ) {
      k++;
    }

    return k;
  }

  add(label: string, id: i32): void {
    const key = label.charCodeAt(0);

    // TODO multi match?
    if (label == this.label) {
      this.id = id;
      return;
    }

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

    for (let i = 0; i < this.params.length; i++) {
      str += this.params[i].toString(lvl + 1);
    }

    return str;
  }
}

export function create(): Node {
  return new Node("/");
}

export function add(routes: Node, route: string, id: i32): void {
  routes.add(route, id);
}

let params = new Array<string>(0);
let paramsI: i32 = 0;

function addToParams(key: string, value: string): void {
  if (paramsI + 1 < params.length) {
    params[paramsI] = key;
    params[paramsI + 1] = value;
  } else {
    params.push(key);
    params.push(value)
  }

  paramsI += 2;
}

export function getParams(): Array<string> {
  return params;
}

export function getHasParams(): i8 {
  return paramsI == 0 ? 0 : 1;
}

export function match(routes: Node, url: string): i32 {
  let node = routes;
  let i = 0;

  paramsI = 0;

  if (routes.label == url) {
    return routes.id;
  }

  while (true) {
    if (url.length <= i) {
      return node.id;
    }

    const key = url.charCodeAt(i);

    if (node.children.has(key)) {
      const child = node.children.get(key);
      const lcp = child.lcp(url, i);

      // perfect match!
      if (lcp == url.length - i) {
        return child.id;
      }

      // the child label is the prefix of value
      if (lcp == child.label.length) {
        node = child;
        i += lcp;
      } else {
        // value and child.label shares some common prefix so no other child could be a match, exit
        return -1;
      }
    } else if (node.params.length) {
      //no regexp atm
      node = node.params[0];

      let k = i;

      while (k < url.length && url.charCodeAt(k) !== node.paramEndCharCode) {
        k++;
      }

      if (paramsI === 0) {
        params = new Array<string>(10);
      }

      if (k === url.length) {
        addToParams(node.paramKey, url.slice(i));

        return node.id;
      }

      addToParams(node.paramKey, url.slice(i, k));

      i = k;
    } else {
      return -1;
    }
  }
}
