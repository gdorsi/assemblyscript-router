const assert = require("assert");
const myModule = require("..");

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

const routes = myModule.create();

let id = 0;

for (let route of testRoutes) {
  myModule.add(routes, route, id++);
}

myModule.add(routes, "/v1/domain/test", id);

assert.strictEqual(myModule.match(routes, "/v1/domain/test"), id);
assert.strictEqual(myModule.match(routes, "not-found"), -1);
console.log("ok");
