#!/usr/bin/env node
const createCompiler = require('../lib/core/webpack')

const webpackCompiler = createCompiler()

webpackCompiler.compile()




