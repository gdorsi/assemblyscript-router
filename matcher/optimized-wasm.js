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

function match(routes, url) {
  return wasmModule.exports.match(routes, newString(url));
}

module.exports = {
  add,
  create,
  match,
};
