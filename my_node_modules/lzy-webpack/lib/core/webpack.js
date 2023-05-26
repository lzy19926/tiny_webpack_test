
const Compiler = require('./Compiler')
const webpackConfig = require('../../../../webpack.config')

function createCompiler() {
    // 创建Compiler
    const compiler = new Compiler(webpackConfig)

    //TODO 根据配置注册所有插件


    return compiler
}


module.exports = createCompiler


