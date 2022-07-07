const fs = require('fs')
const { compress } = require('./compressCode')
const { createGraph, bundleGraph, bundleModules, getProgressCount } = require('./createGraph')


class Webpack {
    constructor(webpackConfig) {
        this.Manifast = null
        this.mapping = null
        this.config = webpackConfig
    }


    //todo 综合方法 创建dist文件夹并生成bundle.js和index.html文件
    createDist(result) {
        const htmlTpl = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="./bundle.js"></script>
    </body>
    </html>`
        const hotReplaceCode = `
    //todo 热模块替换代码  监听src下文件夹变化  重新生成bundle中的代码并传给客户端  使用eval执行代码
    (function hotModuleReplace() {
        var ws = new WebSocket("ws://localhost:3001/");
        //监听建立连接
        ws.onopen = function (res) {
            console.warn('websocket连接成功,热更新准备就绪');
        }
    
        //监听服务端发来的消息
        ws.onmessage = function (res) {
            eval(res.data)
        }
    })();
    `

        //todo 没有dist时创建dist文件夹
        const hasDir = fs.existsSync(this.config.output)
        if (!hasDir) {
            fs.mkdirSync(this.config.output)
        }

        //todo hot为true时进行热更新
        if (this.config?.hot) {
            result = result + hotReplaceCode
        }

        //todo 生产模式进行代码压缩  默认不压缩
        if (this.config?.mode === 'production') {
            result = compress(result)
        }

        //todo 写入文件
        fs.writeFileSync(this.config.output + `/bundle.js`, result)
        fs.writeFileSync(this.config.output + '/index.html', htmlTpl)
    }

    createBundleCode() {
        const entry = this.config.entry
        getProgressCount(entry)
        const graph = createGraph(entry)  // 创建文件依赖图(Manifest)
        this.Manifast = graph // 保存依赖图
        const modules = bundleGraph(graph) // 生成modules
        const result = bundleModules(modules)// 打包模块生成bundle代码
        return result
    }

    bundle() {
        console.time('bundle用时')
        const result = this.createBundleCode()
        console.timeEnd('bundle用时')

        try {
            this.createDist(result)   // 生成dist文件夹
            console.log('打包完成,访问 http://localhost:8080 打开页面');
        } catch (err) {
            console.log(err);
        }

    }
}



module.exports = Webpack 