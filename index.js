let matcherModule = require("./assembly-glue/wasm-runtime");

if (process.env.JS_RUNTIME) {
  matcherModule = require("./assembly-glue/js-runtime");
}

class Router {
  methods = {};

  constructor(opts = {}) {
    this.defaultRoute = opts.defaultRoute;
  }

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

  find(req) {
    const router = this.methods[req.method];

    if (router === undefined) {
      return;
    }

    const match = matcherModule.match(router.matcher, req.url);

    if (match.id === -1) {
      return;
    }

    const handler = router.routes[match.id].handler;

    return {
      handler,
      params: match.params,
    }
  }

  lookup(req, res) {
    const result = this.find(req);

    if (result !== undefined) {
      result.handler(req, res, result.params);
    } else if (this.defaultRoute !== undefined) {
      this.defaultRoute(req, res);
    }
  }
}

function instance(opts) {
  return new Router(opts)
}

module.exports = instance;
