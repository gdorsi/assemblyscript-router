let matcherModule = require("./matcher/optimized-wasm");

if (process.argv.includes('--js')) {
  matcherModule = require("./matcher");
} else if (process.argv.includes('--debug')) {
  matcherModule = require("./matcher/untouched-wasm");
}

class Router {
  methods = {};

  on(method, url, callback) {
    if (!this.methods[method]) {
      this.methods[method] = {
        matcher: matcherModule.create(),
        routes: [],
      };
    }

    const router = this.methods[method];
    const id = router.routes.length;

    router.routes.push({ url, callback });
    matcherModule.add(router.matcher, url, id);
  }

  lookup({ method, url }) {
    const router = this.methods[method];

    if (router === undefined) {
      return;
    }

    const match = matcherModule.match(router.matcher, url);

    if (match.id === -1) {
      return;
    }

    const route = router.routes[match.id];

    route.callback(match.params);
  }
}

module.exports = Router;
