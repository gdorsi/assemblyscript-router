"use strict";

const t = require("tap");
const test = t.test;
const Router = require("..");

const testRoutes = [
  "/v1/domain/users/",
  "/v1/domain/user/",
  "/v1/domain/tasks/",
  "/v1/domain/task/",
  "/v1/param/:name/",
  "/v2/domain/users/",
  "/v2/domain/user/",
  "/v2/domain/tasks/",
  "/v2/domain/task/",
];

test("matches the url when declared as route", (t) => {
  t.plan(1);

  const router = new Router();

  router.on("GET", "/example", function handle() {
    t.ok(true);
  });

  router.lookup({ method: "GET", url: "/example", headers: {} }, null);
});

test("matches the url when declared as param route", (t) => {
  t.plan(1);

  const router = new Router();

  router.on("GET", "/example/:name/", function handle() {
    t.ok(true);
  });

  router.lookup({ method: "GET", url: "/example/guido/", headers: {} }, null);
});

test("matches the url when declared as param route 2", (t) => {
  t.plan(1);

  const router = new Router();

  router.on("GET", "/example/:name", function handle() {
    t.ok(true);
  });

  router.lookup({ method: "GET", url: "/example/guido", headers: {} }, null);
});

test("matches the url when a bunch of routes are declared", (t) => {
  t.plan(1);

  const router = new Router();

  const noop = () => {};

  for (let route of testRoutes) {
    router.on("GET", route, noop);
  }

  router.on("GET", "/v1/domain/test", function handle() {
    t.ok(true);
  });

  router.lookup({ method: "GET", url: "/v1/domain/test", headers: {} }, null);
});

test("doesn't match the url when there isn't any relative route declared", (t) => {
  t.plan(1);
  
  const router = new Router();

  const noop = () => {};

  for (let route of testRoutes) {
    router.on("GET", route, noop);
  }

  let matched = false;

  router.on("GET", "/v1/domain/test", function handle() {
    matched = true;
  });

  router.lookup(
    { method: "GET", url: "/v1/domain/test-not-found", headers: {} },
    null
  );

  t.notOk(matched);
});
