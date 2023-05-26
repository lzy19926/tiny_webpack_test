#!/usr/bin/env node
const WebpackDevServer = require('../lib/devServer/DevServer')
const createCompiler = require('../lib/core/webpack')

const webpackCompiler = createCompiler()

const devServe = new WebpackDevServer(webpackCompiler)

devServe.start()


