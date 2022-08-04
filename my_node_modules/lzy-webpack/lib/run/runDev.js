#!/usr/bin/env node
const WebpackDevServer = require('../lzy_devServer/WebpackDevServer')
const Webpack = require('../lzy_webpack/webpackCompiler')
const webpackConfig = require('../../../../webpack.config')


const webpackCompiler = new Webpack(webpackConfig)
const devServe = new WebpackDevServer(webpackCompiler)

devServe.run()