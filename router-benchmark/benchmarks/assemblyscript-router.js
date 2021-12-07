"use strict";

const { title } = require('../utils')
const runSuite = require('./suite')

process.env.JS_RUNTIME = 1;

const router = require("../../index")();

title("assemblyscript-router js benchmark");

runSuite(router)
