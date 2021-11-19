const assert = require("assert");
const Router = require("..");

const testRoutes = [
  "/v1/domain/users/",
  "/v1/domain/user/",
  "/v1/domain/tasks/",
  "/v1/domain/task/",
  "/v2/domain/users/",
  "/v2/domain/user/",
  "/v2/domain/tasks/",
  "/v2/domain/task/",
];

const router = new Router();

const noop = () => {};

for (let route of testRoutes) {
  router.on("GET", route, noop);
}

let matched = false;

router.on("GET", "/v1/domain/test", () => {
  matched = true;
});

router.lookup({ method: "GET", url: "/v1/domain/test" });

assert.strictEqual(matched, true);

matched = false;

router.lookup({ method: "GET", url: "/v1/domain/not-found" });

assert.strictEqual(matched, false);

console.log("ok");
