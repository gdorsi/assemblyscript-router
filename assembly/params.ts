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
  export function resert(): void {
    paramsSize = 0;
  }
}
