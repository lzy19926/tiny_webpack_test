#!/usr/bin/env node
const Compiler = require('../lzy_webpack/Compiler')
const webpackConfig = require('../../../../webpack.config')


const webpackCompiler = new Compiler(webpackConfig)

webpackCompiler.compile()




