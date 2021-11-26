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

test("find static route", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example", handle);

  const result = router.find(
    { method: "GET", url: "/example", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {});
  t.end();
});

test("find dynamic route with trailing slash", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/:name/", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido/", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {
    name: "guido",
  });
  t.end();
});

test("find dynamic route", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/:name", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {
    name: "guido",
  });
  t.end();
});

test("find dynamic multi-parametric route", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/:name-:surname", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido-dorsi", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {
    name: "guido",
    surname: "dorsi",
  });
  t.end();
});

test("find dynamic parametric route with encoded url", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/:name", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido%20dorsi", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {
    name: "guido dorsi",
  });
  t.end();
});

test("find match-all", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/*", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido/dorsi", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {});
  t.end();
});

test("params should have the priority over", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/*", handle);

  const result = router.find(
    { method: "GET", url: "/example/guido/dorsi", headers: {} },
    null
  );

  t.equal(result?.handler, handle);
  t.same(result?.params, {});
  t.end();
});

test("find non existent method", (t) => {
  const router = new Router();

  function handle() {}

  router.on("GET", "/example/", handle);

  const result = router.find(
    { method: "HELLO", url: "/example/", headers: {} },
    null
  );

  t.equal(result, undefined);
  t.end();
});
