"use strict";

const { title, now, print, operations } = require("../utils");

process.env.JS_RUNTIME = 1;

const router = require("../../index")();

title("assemblyscript-router js benchmark");

const routes = [
  { method: "GET", url: "/user" },
  { method: "GET", url: "/user/comments" },
  { method: "GET", url: "/user/avatar" },
  { method: "GET", url: "/user/lookup/username/:username" },
  { method: "GET", url: "/user/lookup/email/:address" },
  { method: "GET", url: "/event/:id" },
  { method: "GET", url: "/event/:id/comments" },
  { method: "POST", url: "/event/:id/comment" },
  { method: "GET", url: "/map/:location/events" },
  { method: "GET", url: "/status" },
  { method: "GET", url: "/very/deeply/nested/route/hello/there" },
];

var i = 0;
var time = 0;

routes.forEach((route) => {
  router.on(route.method, route.url, () => Math.random());
});

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/user");
}
print("short static:", time);

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/user/comments");
}
print("static with same radix:", time);

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/user/lookup/username/john%20doe");
}
print("dynamic route:", time);

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/event/abcd1234/comments");
}
print("mixed static dynamic:", time);

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/very/deeply/nested/route/hello/there");
}
print("long static:", time);

time = now();
for (i = 0; i < operations; i++) {
  router.lookup("GET", "/user");
  router.lookup("GET", "/user/comments");
  router.lookup("GET", "/user/lookup/username/john%20doe");
  router.lookup("GET", "/event/abcd1234/comments");
  router.lookup("GET", "/very/deeply/nested/route/hello/there");
}
print("all together:", time);
