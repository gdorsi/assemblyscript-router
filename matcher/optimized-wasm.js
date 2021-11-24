const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/../build/optimized.wasm"),
  imports
);

const { __newString, __pin, __getArray, __getString } = wasmModule.exports;

const strings = new Map();

function newString(string) {
  let pStr = strings.get(string);

  if (!pStr) {
    pStr = __newString(string);
    __pin(pStr);
    strings.set(string, pStr);
  }

  return pStr;
}

function create() {
  const matcher = wasmModule.exports.create();

  __pin(matcher);

  return matcher;
}

function add(routes, route, id) {
  return wasmModule.exports.add(routes, newString(route), id);
}

const emptyObj = {}

function match(routes, url) {
  const id = wasmModule.exports.match(routes, newString(url));

  if (id > -1 && wasmModule.exports.getHasParams() === 1) {
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
