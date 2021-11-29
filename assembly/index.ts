import { Node } from "./node";
import { Params } from "./params";
import { SanitizeURL } from "./url-sanitizer";

export function create(): Node {
  return new Node("/");
}

export function add(routes: Node, route: string, id: i32): void {
  routes.add(route, id);
}

export function getParams(): string[] {
  return Params.get();
}

export function hasParams(): i32 {
  return Params.size() > 0 ? 1 : 0;
}

export function match(routes: Node, url: string): i32 {
  url = SanitizeURL.apply(url);

  let node = routes;
  let i = 0;

  Params.resert();

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
        if (SanitizeURL.hasEncodedComponents()) {
          Params.add(node.paramKey, decodeURIComponent(url.slice(i)));
        } else {
          Params.add(node.paramKey, url.slice(i));
        }

        return node.id;
      }

      if (SanitizeURL.hasEncodedComponents()) {
        Params.add(node.paramKey, decodeURIComponent(url.slice(i, k)));
      } else {
        Params.add(node.paramKey, url.slice(i, k));
      }

      i = k;
    } else {
      return -1;
    }
  }
}
