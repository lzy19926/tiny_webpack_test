const path = require('path')
const HtmlPlugin = require('./my_node_modules/webpackPlugin/htmlPlugin')
const CssExtractPlugin = require('./my_node_modules/webpackPlugin/cssExtractPlugin')
const cssLoader = require('./my_node_modules/webpackLoader/lzy-cssLoader/cssLoader')
const lzyLoader = require('./my_node_modules/webpackLoader/lzy-loader/index')
const jsxLoader = require('./my_node_modules/webpackLoader/jsx-loader/index')

module.exports = {
    mode: 'development', // development|production
    rootPath: __dirname, // 项目根路径
    entry: path.join(__dirname, '/src/index.lzy'), //配置打包入口
    output: path.join(__dirname, '/dist'), // 出口


    devServer: {
        port: 8000,// 端口
        socketPort: 8001,// 使用的webSocket的端口
        hot: true,// 启动热更新
        cors: true,// 配置是否能跨域
        staticPath: './public',// 静态资源托管文件夹
        publicPath: 'http://localhost:8000'         // 读取静态资源的地址(比如localhost:8000) 默认为本服务的端口
    },

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
        },
        {
            test: /\.jsx$/,
            use: [jsxLoader] //! lzy文件经过lzyloader处理
        }
    ]
}

