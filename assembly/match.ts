import { getLongestCommonPrefix, Node, nodeToString } from "./node";
import { Params } from "./params";
import { SanitizeURL } from "./url-sanitizer";

function walkThree(node: Node, url: string, i: i32): i32 {
  while (true) {
    if (url.length <= i) {
      return node.id;
    }

    const key = url.charCodeAt(i);

    if (node.children.has(key)) {
      const child = node.children.get(key);
      const lcp = getLongestCommonPrefix(child, url, i);

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
      // TODO optmize, use recursion only when required
      const pSize = Params.size();

      for (let p = 0; p < node.params.length; p++) {
        const child = node.params[p];

        const k = Params.read(
          child,
          url,
          i,
          SanitizeURL.hasEncodedComponents()
        );

        if (k === url.length) {
          return child.id;
        }

        const id = walkThree(child, url, k);

        if (id > -1) {
          return id;
        }

        // delete the read params
        Params.setSize(pSize);
      }

      return -1;
    } else if (node.wildcards.length) {
      node = node.wildcards[0];

      while (i < url.length && url.charCodeAt(i) !== node.delimiterCharCode) {
        i++;
      }

      if (i === url.length) {
        return node.id
      }
    } else {
      return -1;
    }
  }
}

export function match(routes: Node, url: string): i32 {
  url = SanitizeURL.apply(url);

  Params.reset();

  if (routes.label == url || url == '') {
    return routes.id;
  }

  // TODO verify if this is correct
  const start = url.charCodeAt(0) == 47 ? 1 : 0

  return walkThree(routes, url, start);
}
