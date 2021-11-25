enum NodeType {
  STATIC = 0,
  PARAM = 1,
}

export class Node {
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

    this.parseLabel()
  }

  get key(): i32 {
    return this.label.charCodeAt(0);
  }

  parseLabel(): void {
    if (this.type === NodeType.STATIC) {
      const i = this.label.indexOf(":");

      if (i !== -1) {
        const child = new Node(this.label.slice(i), this.id);

        this.params.push(child);

        this.label = this.label.slice(0, i);
        this.id = -1;
      }
    } else if (this.type === NodeType.PARAM) {
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
