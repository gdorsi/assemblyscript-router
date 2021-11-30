import { insert } from "./insert";
import { getLongestCommonPrefix, Node, nodeToString } from "./node";
import { Params } from "./params";
import { SanitizeURL } from "./url-sanitizer";

export function create(): Node {
  return new Node("/");
}

export function add(routes: Node, route: string, id: i32): void {
  insert(routes, route, id);
}

export function getParams(): string[] {
  return Params.get();
}

export function hasParams(): i32 {
  return Params.size() > 0 ? 1 : 0;
}

export { match } from "./match";
