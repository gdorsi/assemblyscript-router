const fs = require("fs");
const loader = require("@assemblyscript/loader");
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm")
);

const { __newString, __pin } = wasmModule.exports;

class Router {
  methods = {};

  on(method, url, callback) {
    if (!this.methods[method]) {
      const matcher = wasmModule.exports.create();;

      __pin(matcher);

      this.methods[method] = {
        matcher,
        routes: [],
      };
    }

    const router = this.methods[method];
    const id = router.routes.length;

    router.routes.push({ url, callback });
    wasmModule.exports.add(router.matcher, __newString(url), id);
  }

  lookup({ method, url }) {
    const router = this.methods[method];

    if (router === undefined) {
        return;
    }

    const id = wasmModule.exports.match(router.matcher, __newString(url));

    if (id === -1) {
        return;
    }

    const route = router.routes[id];

    route.callback();
  }
}

module.exports = Router;
