'use strict'

const { title } = require('../utils')
const runSuite = require('./suite')
const router = require('find-my-way')()

title('find-my-way benchmark')

runSuite(router)
