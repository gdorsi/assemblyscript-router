const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/../build/untouched.wasm"),
  imports
);

const { __newString, __pin } = wasmModule.exports;

function create() {
  const matcher = wasmModule.exports.create();

  __pin(matcher);

  return matcher;
}

function add(routes, route, id) {
  return wasmModule.exports.add(routes, __newString(route), id);
}

function match(routes, url) {
  return wasmModule.exports.match(routes, __newString(url));
}

module.exports = {
  add,
  create,
  match,
};
