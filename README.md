# Assemblyscript Router

Hello!

I wrote this library in order to check if an assemblyscript router would be faster than a Javascript one.

In order to check this I've compiled the assemblyscript code both in WASM and Javascript (using SWC)

These are the benchmarks:
```
======================================
 assemblyscript-router wasm benchmark
======================================
short static: 7,546,905 ops/sec
static with same radix: 4,968,716 ops/sec
dynamic route: 673,665 ops/sec
mixed static dynamic: 839,835 ops/sec
long static: 3,217,842 ops/sec
wildcard: 2,831,659 ops/sec
all together: 266,137 ops/sec

====================================
 assemblyscript-router js benchmark
====================================
short static: 12,114,572 ops/sec
static with same radix: 4,497,030 ops/sec
dynamic route: 1,409,397 ops/sec
mixed static dynamic: 3,130,584 ops/sec
long static: 1,859,515 ops/sec
wildcard: 3,377,575 ops/sec
all together: 450,301 ops/sec

=======================
 find-my-way benchmark
=======================
short static: 20,697,111 ops/sec
static with same radix: 6,502,198 ops/sec
dynamic route: 1,450,696 ops/sec
mixed static dynamic: 4,051,463 ops/sec
long static: 4,890,342 ops/sec
wildcard: 3,714,118 ops/sec
all together: 592,396 ops/sec
```

EDIT: There where some bugs in the bench suite before
