const Webpack = require('./lzy_webpack/webpackCompiler')
const WebpackDevServer = require('./lzy_devServer/WebpackDevServer')
const importStatic = require('./lzy_webpack/importStatic')

module.exports = { Webpack, WebpackDevServer, importStatic }