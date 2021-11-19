const fs = require("fs");
const loader = require("@assemblyscript/loader");
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm")
);

const { __newString, __pin } = wasmModule.exports;

class Router {
  methods = new Map();

  on(method, url, callback) {
    if (!this.methods.has(method)) {
      const matcher = create();

      __pin(matcher);

      this.methods.set(method, {
        matcher,
        routes: [],
      });
    }

    const router = this.methods.get(method);
    const id = router.routes.length;

    router.routes.push({ url, callback });
    add(router.matcher, url, id);
  }

  lookup({ method, url }) {
    const router = this.methods.get(method);

    if (!router) {
        return;
    }

    const id = match(router.matcher, url);

    if (id === -1) {
        return;
    }

    const route = router.routes[id];

    route.callback();
  }
}

function create() {
  return wasmModule.exports.create();
}

function add(routes, route, id) {
  return wasmModule.exports.add(routes, __newString(route), id);
}

function match(routes, url) {
  return wasmModule.exports.match(routes, __newString(url));
}

module.exports = Router;
