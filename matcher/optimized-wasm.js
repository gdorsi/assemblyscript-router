const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/../build/optimized.wasm"),
  imports
);

const { __newString, __pin } = wasmModule.exports;

function create() {
  const matcher = wasmModule.exports.create();

  __pin(matcher);

  return matcher;
}

const strings = new Map();

function add(routes, route, id) {
  let pStr = strings.get(route);

  if (!pStr) {
    pStr = __newString(route);
    __pin(pStr);
    strings.set(route, pStr);
  }

  return wasmModule.exports.add(routes, pStr, id);
}

function match(routes, url) {
  let pStr = strings.get(url);

  if (!pStr) {
    pStr = __newString(url);
    __pin(pStr);
    strings.set(url, pStr);
  }

  return wasmModule.exports.match(routes, pStr);
}

module.exports = {
  add,
  create,
  match,
};
