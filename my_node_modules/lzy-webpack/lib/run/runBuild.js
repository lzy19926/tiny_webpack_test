#!/usr/bin/env node
const Compiler = require('../lzy_webpack/webpackCompiler')
const webpackConfig = require('../../../../webpack.config')


const webpackCompiler = new Compiler(webpackConfig)

webpackCompiler.bundle()




