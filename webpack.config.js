const path = require('path')
const HtmlPlugin = require('./my_node_modules/webpackPlugin/htmlPlugin')
const CssExtractPlugin = require('./my_node_modules/webpackPlugin/cssExtractPlugin')
const cssLoader = require('./my_node_modules/webpackLoader/lzy-cssLoader/cssLoader')
const lzyLoader = require('./my_node_modules/webpackLoader/lzy-loader/index')


module.exports = {
    mode: 'development', // development|production
    rootPath: __dirname, // 项目根路径
    entry: path.join(__dirname, '/src/index.js'), //配置打包入口
    output: path.join(__dirname, '/dist'), // 出口
    hot: true,// 启动热更新

    plugins: [
        new HtmlPlugin({ fileName: 'index.html' }),   //! 打包生成html文件插件
        new CssExtractPlugin({ fileName: 'index.css' }) //! 打包CSS插件
    ],
    rules: [
        {
            test: /\.css$/,
            use: [cssLoader] //! CSS尾缀的文件会通过cssLoader处理
        },
        {
            test: /\.lzy$/,
            use: [lzyLoader] //! lzy文件经过lzyloader处理
        }
    ]
}

