'use strict'

const { fork } = require('child_process')
const { resolve } = require('path')
const { Queue } = require('./utils')

const benchmarks = [
  'assemblyscript-router-wasm.js',
  'assemblyscript-router.js',
  'find-my-way.js',
  
]

const queue = new Queue()

benchmarks.forEach(file => {
  queue.add(runner.bind({ file: resolve('benchmarks', file) }))
})

function runner (done) {
  const process = fork(this.file)
  process.on('close', done)
}
