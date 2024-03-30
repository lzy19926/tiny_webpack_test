const path = require('path')
const HtmlPlugin = require('./my_node_modules/webpackPlugin/htmlPlugin')
const CssExtractPlugin = require('./my_node_modules/webpackPlugin/cssExtractPlugin')
const cssLoader = require('./my_node_modules/webpackLoader/lzy-cssLoader/cssLoader')
const lzyLoader = require('./my_node_modules/webpackLoader/lzy-loader/index')
const jsxLoader = require('./my_node_modules/webpackLoader/jsx-loader/index')

module.exports = {
    mode: 'development', // development|production
    rootPath: __dirname, // 项目根路径

    entry: path.join(__dirname, '/src/LzyDoc/index.lzy'), //文档入口
    // entry: path.join(__dirname, '/src/LzyReact_App/index.lzy'), //全部文档入口(旧版)
    // entry: path.join(__dirname, '/src/libTest/formatjsTest/app.lzy'), //formatjsTest测试入口



    output: path.join(__dirname, '/dist'),

    devServer: {
        port: 8000,// 端口
        socketPort: 8001,// 使用的webSocket的端口
        hot: true,// 启动热更新
        cors: true,// 配置是否能跨域
        staticPath: './public',// 静态资源托管文件夹
        publicPath: 'http://localhost:8000'         // 读取静态资源的地址(比如localhost:8000) 默认为本服务的端口
    },

    plugins: [
        //! 打包生成html文件插件
        new HtmlPlugin({
            template: path.join(__dirname, '/public/index.html'),
            fileName: 'index.html'
        }),
        //! 打包CSS插件
        new CssExtractPlugin({
            fileName: 'bundle.css'
        })
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
    ],

    //todo 外部脚本引入功能
    externals: [
        {
            name: 'jQuery',
            type: 'script',
            src: 'https://cdn.bootcdn.net/ajax/libs/zui/1.10.0/lib/jquery/jquery.js',
        }
    ],

    // 构建模块化规范选择 默认commonjs
    library: {
        type: 'commonjs',
    },
}
