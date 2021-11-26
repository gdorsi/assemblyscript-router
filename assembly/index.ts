import { Node, NodeType } from "./node";
import { getContainsEncodedComponents, sanitizeUrl } from "./url-sanitizer";

export function create(): Node {
  return new Node("/");
}

export function add(routes: Node, route: string, id: i32): void {
  routes.add(route, id);
}

let params = new Array<string>(0);
let paramsSize: i32 = 0;

// @inline
function addToParams(key: string, value: string): void {
  if (paramsSize === 0) {
    params = new Array<string>(10);
  }

  if (paramsSize + 1 < params.length) {
    params[paramsSize] = key;
    params[paramsSize + 1] = value;
  } else {
    params.push(key);
    params.push(value);
  }

  paramsSize += 2;
}

export function getParams(): Array<string> {
  return params;
}

export function getParamsSize(): i32 {
  return paramsSize;
}

export function match(routes: Node, url: string): i32 {
  url = sanitizeUrl(url);

  const containsEncodedComponents = getContainsEncodedComponents();

  let node = routes;
  let i = 0;

  paramsSize = 0;

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

      if (k === url.length) {
        if (node.type !== NodeType.MATCH_ALL) {
          if (containsEncodedComponents) {
            addToParams(node.paramKey, decodeURIComponent(url.slice(i)));
          } else {
            addToParams(node.paramKey, url.slice(i));
          }

          return node.id;
        }

        if (node.type !== NodeType.MATCH_ALL) {
          if (containsEncodedComponents) {
            addToParams(node.paramKey, decodeURIComponent(url.slice(i, k)));
          } else {
            addToParams(node.paramKey, url.slice(i, k));
          }
        }

        i = k;
      } else {
        return -1;
      }
    }
  }
}
