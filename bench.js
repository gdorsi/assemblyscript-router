'use strict'

const Benchmark = require('benchmark')
// The default number of samples for Benchmark seems to be low enough that it
// can generate results with significant variance (~2%) for this benchmark
// suite. This makes it sometimes a bit confusing to actually evaluate impact of
// changes on performance. Setting the minimum of samples to 500 results in
// significantly lower variance on my local setup for this tests suite, and
// gives me higher confidence in benchmark results.
Benchmark.options.minSamples = 500

const suite = Benchmark.Suite()

const Router = require('./')

const router = new Router()
router.on('GET', '/', () => true)
router.on('GET', '/user/:id', () => true)
router.on('GET', '/user/:id/static', () => true)
router.on('POST', '/user/:id', () => true)
router.on('PUT', '/user/:id', () => true)
router.on('GET', '/customer/:name-:surname', () => true)
router.on('POST', '/customer', () => true)
router.on('GET', '/at/:hour(^\\d+)h:minute(^\\d+)m', () => true)
router.on('GET', '/abc/def/ghi/lmn/opq/rst/uvz', () => true)

router.on('GET', '/products', () => true)
router.on('GET', '/products/:id', () => true)
router.on('GET', '/products/:id/options', () => true)

router.on('GET', '/posts', () => true)
router.on('POST', '/posts', () => true)
router.on('GET', '/posts/:id', () => true)
router.on('GET', '/posts/:id/author', () => true)
router.on('GET', '/posts/:id/comments', () => true)
router.on('POST', '/posts/:id/comments', () => true)
router.on('GET', '/posts/:id/comments/:id', () => true)
router.on('GET', '/posts/:id/comments/:id/author', () => true)
router.on('GET', '/posts/:id/counter', () => true)

// const constrained = new Router()
// constrained.on('GET', '/', () => true)
// constrained.on('GET', '/versioned', () => true)
// constrained.on('GET', '/versioned', { constraints: { version: '1.2.0' } }, () => true)
// constrained.on('GET', '/versioned', { constraints: { version: '2.0.0', host: 'example.com' } }, () => true)
// constrained.on('GET', '/versioned', { constraints: { version: '2.0.0', host: 'fastify.io' } }, () => true)

suite
  .add('lookup static route', function () {
    router.lookup({ method: 'GET', url: '/', headers: { host: 'fastify.io' } }, null)
  })
  .add('lookup dynamic route', function () {
    router.lookup({ method: 'GET', url: '/user/tomas', headers: { host: 'fastify.io' } }, null)
  })
  .add('lookup dynamic multi-parametric route', function () {
    router.lookup({ method: 'GET', url: '/customer/john-doe', headers: { host: 'fastify.io' } }, null)
  })
  // .add('lookup dynamic multi-parametric route with regex', function () {
  //   router.lookup({ method: 'GET', url: '/at/12h00m', headers: { host: 'fastify.io' } }, null)
  // })
  .add('lookup long static route', function () {
    router.lookup({ method: 'GET', url: '/abc/def/ghi/lmn/opq/rst/uvz', headers: { host: 'fastify.io' } }, null)
  })
  .add('lookup long dynamic route', function () {
    router.lookup({ method: 'GET', url: '/user/qwertyuiopasdfghjklzxcvbnm/static', headers: { host: 'fastify.io' } }, null)
  })
  // .add('lookup static route on constrained router', function () {
  //   constrained.lookup({ method: 'GET', url: '/', headers: { host: 'fastify.io' } }, null)
  // })
  // .add('lookup static versioned route', function () {
  //   constrained.lookup({ method: 'GET', url: '/versioned', headers: { 'accept-version': '1.x', host: 'fastify.io' } }, null)
  // })
  // .add('lookup static constrained (version & host) route', function () {
  //   constrained.lookup({ method: 'GET', url: '/versioned', headers: { 'accept-version': '2.x', host: 'fastify.io' } }, null)
  // })
  .add('find static route', function () {
    router.find('GET', '/', undefined)
  })
  .add('find dynamic route', function () {
    router.find('GET', '/user/tomas', undefined)
  })
  .add('find dynamic route with encoded parameter unoptimized', function () {
    router.find('GET', '/user/maintainer%2Btomas', undefined)
  })
  .add('find dynamic route with encoded parameter optimized', function () {
    router.find('GET', '/user/maintainer%20tomas', undefined)
  })
  .add('find dynamic multi-parametric route', function () {
    router.find('GET', '/customer/john-doe', undefined)
  })
  // .add('find dynamic multi-parametric route with regex', function () {
  //   router.find('GET', '/at/12h00m', undefined)
  // })
  .add('find long static route', function () {
    router.find('GET', '/abc/def/ghi/lmn/opq/rst/uvz', undefined)
  })
  .add('find long dynamic route', function () {
    router.find('GET', '/user/qwertyuiopasdfghjklzxcvbnm/static', undefined)
  })
  .add('find long nested dynamic route', function () {
    router.find('GET', '/posts/10/comments/42/author', undefined)
  })
  .add('find long nested dynamic route with encoded parameter unoptimized', function () {
    router.find('GET', '/posts/10%2C10/comments/42%2C42/author', undefined)
  })
  .add('find long nested dynamic route with encoded parameter optimized', function () {
    router.find('GET', '/posts/10%2510/comments/42%2542/author', undefined)
  })
  .add('find long nested dynamic route with other method', function () {
    router.find('POST', '/posts/10/comments', undefined)
  })
  .add('find long nested dynamic route', function () {
    router.find('GET', '/posts/10/comments/42/author', undefined)
  })
  .add('find long nested dynamic route with other method', function () {
    router.find('POST', '/posts/10/comments', undefined)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {})
  .run()
