let matcherModule = require("./assembly-glue/wasm-runtime");

if (process.env.JS_RUNTIME) {
  matcherModule = require("./assembly-glue/js-runtime");
}

class Router {
  methods = {};

  on(method, url, handler) {
    if (!this.methods[method]) {
      this.methods[method] = {
        matcher: matcherModule.create(),
        routes: [],
      };
    }

    const router = this.methods[method];
    const id = router.routes.length;

    router.routes.push({ url, handler });
    matcherModule.add(router.matcher, url, id);
  }

  find(opts) {
    const router = this.methods[opts.method];

    if (router === undefined) {
      return;
    }

    const match = matcherModule.match(router.matcher, opts.url);

    if (match.id === -1) {
      return;
    }

    const handler = router.routes[match.id].handler;

    return {
      handler,
      params: match.params,
    }
  }

  lookup(opts) {
    const result = this.find(opts);

    if (result !== undefined) {
      result.handler(result.params);
    }
  }
}

function instance() {
  return new Router()
}

module.exports = instance;
