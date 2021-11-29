import { Node } from "./node";
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

export function match(routes: Node, url: string, length: i32): i32 {
  url = sanitizeUrl(url, length);

  if (url.length < length) {
    length = url.length;
  }

  const containsEncodedComponents = getContainsEncodedComponents();

  let node = routes;
  let i = 0;

  paramsSize = 0;

  if (routes.label == url) {
    return routes.id;
  }

  while (true) {
    if (length <= i) {
      return node.id;
    }

    const key = url.charCodeAt(i);

    if (node.children.has(key)) {
      const child = node.children.get(key);
      const lcp = child.lcp(url, i);

      // perfect match!
      if (lcp == length - i) {
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

      while (k < length && url.charCodeAt(k) !== node.paramEndCharCode) {
        k++;
      }

      if (k === length) {
        if (containsEncodedComponents) {
          addToParams(node.paramKey, decodeURIComponent(url.slice(i, length)));
        } else {
          addToParams(node.paramKey, url.slice(i, length));
        }

        return node.id;
      }

      if (containsEncodedComponents) {
        addToParams(node.paramKey, decodeURIComponent(url.slice(i, k)));
      } else {
        addToParams(node.paramKey, url.slice(i, k));
      }

      i = k;
    } else {
      return -1;
    }
  }
}
