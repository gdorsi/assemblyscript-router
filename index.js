const defaultMatcherModule = require("./matcher/optimized-wasm");

class Router {
  methods = {};

  constructor(matcherModule = defaultMatcherModule) {
    this.matcherModule = matcherModule;
  }

  on(method, url, callback) {
    if (!this.methods[method]) {
      this.methods[method] = {
        matcher: this.matcherModule.create(),
        routes: [],
      };
    }

    const router = this.methods[method];
    const id = router.routes.length;

    router.routes.push({ url, callback });
    this.matcherModule.add(router.matcher, url, id);
  }

  lookup({ method, url }) {
    const router = this.methods[method];

    if (router === undefined) {
      return;
    }

    const match = this.matcherModule.match(router.matcher, url);

    if (match.id === -1) {
      return;
    }

    const route = router.routes[match.id];

    route.callback(match.params);
  }
}

module.exports = Router;
