#!/usr/bin/env node
const WebpackDevServer = require('./core/WebpackDevServer')
const webpackConfig = require('../../webpack.config')
const Webpack = require('../../lzy-webpack/src/core/webpackCompiler')



const webpackCompiler = new Webpack(webpackConfig)
const devServe = new WebpackDevServer(webpackCompiler)


devServe.run()