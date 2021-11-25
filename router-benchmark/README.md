# router-benchmark

A fork of https://github.com/delvedor/router-benchmark to compare this router with find-my-way

Results:

```
======================================
 assemblyscript-router wasm benchmark
======================================
short static: 64,860,151 ops/sec
static with same radix: 66,445,792 ops/sec
dynamic route: 66,247,721 ops/sec
mixed static dynamic: 65,750,322 ops/sec
long static: 65,873,662 ops/sec
wildcard: 62,509,205 ops/sec
all together: 13,142,462 ops/sec

====================================
 assemblyscript-router js benchmark
====================================
short static: 52,250,925 ops/sec
static with same radix: 67,555,718 ops/sec
dynamic route: 68,548,816 ops/sec
mixed static dynamic: 66,110,505 ops/sec
long static: 64,703,318 ops/sec
wildcard: 66,923,465 ops/sec
all together: 12,791,204 ops/sec

=======================
 find-my-way benchmark
=======================
short static: 13,637,776 ops/sec
static with same radix: 5,097,896 ops/sec
dynamic route: 1,799,431 ops/sec
mixed static dynamic: 2,726,258 ops/sec
long static: 5,725,190 ops/sec
wildcard: 3,645,835 ops/sec
all together: 613,139 ops/sec
```
