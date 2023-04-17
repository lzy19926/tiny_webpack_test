#!/usr/bin/env node
const DevServer = require('../lzy_devServer/DevServer')
const Compiler = require('../lzy_webpack/Compiler')
const webpackConfig = require('../../../../webpack.config')


const webpackCompiler = new Compiler(webpackConfig)
const devServe = new DevServer(webpackCompiler)

devServe.run()