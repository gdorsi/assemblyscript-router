"use strict";

const { title } = require('../utils')
const runSuite = require('./suite')

const router = require("../../index")();

title("assemblyscript-router wasm benchmark");

runSuite(router)
