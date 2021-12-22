const http = require("http");

let matcherModule = require("./assembly-glue/wasm-runtime");

if (process.env.JS_RUNTIME) {
  matcherModule = require("./assembly-glue/js-runtime");
}

class Router {
  methods = {};

  constructor(opts = {}) {
    this.defaultRoute = opts.defaultRoute;
    this.onBadUrl = opts.onBadUrl;
  }

  prettyPrint() {
    throw new Error("Not implemented yet");
  }

  on(method, url, opts, handler, store) {
    if (Array.isArray(method)) {
      for (var k = 0; k < method.length; k++) {
        this.on(method[k], url, opts, handler);
      }
      return;
    }

    if (typeof opts === "function") {
      store = handler;
      handler = opts;
      opts = undefined;
    }

    if (!this.methods[method]) {
      this.methods[method] = {
        matcher: matcherModule.create(),
        routes: [],
      };
    }

    const router = this.methods[method];
    const id = router.routes.length;

    router.routes.push({ url, handler, store });
    matcherModule.add(router.matcher, url, id);
  }

  find(method, url) {
    const router = this.methods[method];

    if (router === undefined) {
      return;
    }

    const match = matcherModule.match(router.matcher, url);

    if (match.id === -1) {
      return;
    }

    const route = router.routes[match.id];

    return {
      handler: route.handler,
      params: match.params,
      store: route.store,
    };
  }

  lookup(req, res, ctx) {
    const result = this.find(req);

    if (result !== undefined) {
      if (ctx === undefined) {
        return result.handler(req, res, result.params, result.store);
      } else {
        return result.handler.call(ctx, req, res, result.params, result.store);
      }
    } else if (this.defaultRoute !== undefined) {
      return this.defaultRoute(req, res, ctx);
    }
  }
}

for (var i in http.METHODS) {
  /* eslint no-prototype-builtins: "off" */
  if (!http.METHODS.hasOwnProperty(i)) continue;
  const m = http.METHODS[i];
  const methodName = m.toLowerCase();

  if (Router.prototype[methodName])
    throw new Error("Method already exists: " + methodName);

  Router.prototype[methodName] = function (path, handler, store) {
    return this.on(m, path, handler, store);
  };
}

Router.prototype.all = function (path, handler, store) {
  this.on(httpMethods, path, handler, store);
};

function instance(opts) {
  return new Router(opts);
}

module.exports = instance;
