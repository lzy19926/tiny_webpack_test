const Koa = require('koa');
const path = require('path')
const serve = require("koa-static")
const Webpack = require('../../../lzy-webpack/src/core/webpackCompiler')
const { hotUpdate } = require('./hotUpdate')


function startServer(webpackConfig) {
    const app = new Koa();
    const webpack = new Webpack(webpackConfig)
    const topPath = path.resolve(webpack.config.entry, '..', '..')
    app.use(serve(topPath + "/dist", { extensions: ["html"] })) //访问静态html文件


    hotUpdate(webpack, app) //todo 开启热更新功能


    app.listen(8080, () => {
        console.log('dev-server启动在8080端口');
        webpack.bundle()
    })
}


module.exports = { startServer }