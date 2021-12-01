# Assemblyscript Router

Hello!

I wrote this library in order to check if an assemblyscript router would be faster than a Javascript one.

In order to check this I've compiled the assemblyscript code both in WASM and Javascript (using SWC)

These are the benchmarks:
```
======================================
 assemblyscript-router wasm benchmark
======================================
short static: 148,849,578 ops/sec
static with same radix: 150,739,376 ops/sec
dynamic route: 151,146,254 ops/sec
mixed static dynamic: 151,152,443 ops/sec
long static: 149,692,756 ops/sec
all together: 33,979,491 ops/sec

====================================
 assemblyscript-router js benchmark
====================================
short static: 149,692,848 ops/sec
static with same radix: 151,961,442 ops/sec
dynamic route: 152,146,599 ops/sec
mixed static dynamic: 152,033,736 ops/sec
long static: 151,378,491 ops/sec
all together: 34,188,648 ops/sec
```

It seems that the resulting performance are pretty much the same.

Also Assemblyscript doesn't have [builtin Regexp support](https://github.com/AssemblyScript/assemblyscript/issues/1188) that makes an harder job to support RegExps in routes.

Anyway JS code written with the Assemblyscript restictions is pretty damn fast!

This is a comparison with find-my-way:

```
====================================
 assemblyscript-router js benchmark
====================================
short static: 149,692,848 ops/sec
static with same radix: 151,961,442 ops/sec
dynamic route: 152,146,599 ops/sec
mixed static dynamic: 152,033,736 ops/sec
long static: 151,378,491 ops/sec
all together: 34,188,648 ops/sec

=======================
 find-my-way benchmark
=======================
short static: 20,952,687 ops/sec
static with same radix: 6,588,344 ops/sec
dynamic route: 1,486,278 ops/sec
mixed static dynamic: 4,135,777 ops/sec
long static: 5,050,963 ops/sec
all together: 730,227 ops/sec
```

I know, I know, find-my-way has an incredible quantity of features that placed inside of assemblyscript-router would make it significantly slower (maybe).
