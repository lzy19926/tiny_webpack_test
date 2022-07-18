const path = require('path')
module.exports = {
    mode: 'development', // development|production
    rootPath: __dirname, // 项目根路径
    entry: path.join(__dirname, '/src/index.js'), //配置打包入口
    output: path.join(__dirname, '/dist'), // 出口
    hot: true,// 启动热更新
}
