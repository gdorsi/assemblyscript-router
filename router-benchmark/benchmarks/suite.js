"use strict";

const { now, print, operations } = require("../utils");

const routes = [
  { method: "GET", url: "/user" },
  { method: "GET", url: "/user/comments" },
  { method: "GET", url: "/user/avatar" },
  { method: "GET", url: "/user/find/username/:username" },
  { method: "GET", url: "/user/find/email/:address" },
  { method: "GET", url: "/event/:id" },
  { method: "GET", url: "/event/:id/comments" },
  { method: "POST", url: "/event/:id/comment" },
  { method: "GET", url: "/map/:location/events" },
  { method: "GET", url: "/status" },
  { method: "GET", url: "/very/deeply/nested/route/hello/there" },
  { method: "GET", url: "/wildcard/*" },
];

function runSuite(router) {
  var i = 0;
  var time = 0;

  routes.forEach((route) => {
    router.on(route.method, route.url, () => Math.random());
  });

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/user");
  }
  print("short static:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/user/comments");
  }
  print("static with same radix:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/user/find/username/john%20doe");
  }
  print("dynamic route:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/event/abcd1234/comments");
  }
  print("mixed static dynamic:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/very/deeply/nested/route/hello/there");
  }
  print("long static:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/wildcard/very/deeply/nested/route/hello/there");
  }
  print("wildcard:", time);

  time = now();
  for (i = 0; i < operations; i++) {
    router.find("GET", "/user");
    router.find("GET", "/user/comments");
    router.find("GET", "/user/find/username/john%20doe");
    router.find("GET", "/event/abcd1234/comments");
    router.find("GET", "/very/deeply/nested/route/hello/there");
    router.find("GET", "/wildcard/very/deeply/nested/route/hello/there");
  }
  print("all together:", time);
}

module.exports = runSuite