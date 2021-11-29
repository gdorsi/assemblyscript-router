const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/../build/untouched.wasm"),
  imports
);

const { __new, memory, __newString, __pin, __getArray, __getString } = wasmModule.exports;

function create() {
  const matcher = wasmModule.exports.create();

  __pin(matcher);

  return matcher;
}

function add(routes, route, id) {
  return wasmModule.exports.add(routes, __newString(route), id);
}

const emptyObj = {}

const pUrlStr = __new(2046 << 1, 1 /* STRING_ID */);

__pin(pUrlStr);

function __copyString(str, ptr) {
  if (str == null) return 0;
  const length = str.length;
  const U16 = new Uint16Array(memory.buffer);
  for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
  return ptr;
}

function match(routes, url) {
  const id = wasmModule.exports.match(routes, __copyString(url, pUrlStr), url.length);

  if (id > -1 && wasmModule.exports.getParamsSize() > 0) {
    const pParams = __getArray(wasmModule.exports.getParams());

    let params = {};

    for (let i = 0; i < pParams.length; i += 2) {
      if (pParams[i] !== 0) {
        params[__getString(pParams[i])] = __getString(pParams[i + 1]);
      }
    }

    return { id, params };
  }

  return { id, params: emptyObj };
}

module.exports = {
  add,
  create,
  match,
};
