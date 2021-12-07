import { Node } from "./node";

let params = new Array<string>(0);
let paramsSize: i32 = 0;

export namespace Params {
  // @inline
  export function add(key: string, value: string): void {
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

  // @inline
  export function get(): Array<string> {
    return params;
  }

  // @inline
  export function size(): i32 {
    return paramsSize;
  }

  // @inline
  export function setSize(value: i32): void {
    paramsSize = value;
  }

  // @inline
  export function reset(): void {
    paramsSize = 0;
  }

  // @inline
  export function read(
    node: Node,
    url: string,
    start: i32,
    decode: boolean
  ): i32 {
    let k = start;

    while (k < url.length && url.charCodeAt(k) !== node.delimiterCharCode) {
      k++;
    }

    let value = url.slice(start, k);

    if (decode) {
      value = decodeURIComponent(value);
    }

    add(node.paramName, value);

    return k;
  }
}
