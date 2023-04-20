#!/usr/bin/env node
const DevServer = require('../lzy_devServer/DevServer')
const createCompiler = require('../lzy_webpack/webpack')


const webpackCompiler = createCompiler()
const devServe = new DevServer(webpackCompiler)

devServe.run()