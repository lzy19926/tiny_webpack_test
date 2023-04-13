const Compiler = require('./lzy_webpack/webpackCompiler')
const DevServer = require('./lzy_devServer/DevServer')
const importStatic = require('./lzy_webpack/importStatic')

module.exports = { Compiler, DevServer, importStatic }