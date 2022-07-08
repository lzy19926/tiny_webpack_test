const fs = require('fs')
const path = require('path')
const { changeColor } = require('./utils')
const { createGraph, bundleGraph, bundleModules, getProgressCount } = require('./createGraph')

class Webpack {
    constructor(webpackConfig) {
        this.Manifast = null // 细节图
        this.mapping = null;// KV对应
        this.config = webpackConfig
    }

    createNewModuleStr(entry) {
        const newGraph = createGraph(entry)
        return bundleGraph(newGraph)
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

        //todo 没有dist时创建dist文件夹
        const hasDir = fs.existsSync(this.config.output)
        if (!hasDir) {
            fs.mkdirSync(this.config.output)
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
        const result = this.createBundleCode()

        try {
            this.createDist(result)   // 生成dist文件夹
            const coloredPath = changeColor(path.basename(this.config.output), 96)
            console.log(`打包成功 请查看${coloredPath}文件夹`)
        } catch (err) {
            console.log(err);
        }
    }
}



module.exports = Webpack 