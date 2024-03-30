const fs = require("fs")
const path = require("path")
const { changeColor } = require('../../progressBar/changeColor')


// 创建输出代码的Dist文件夹
class CreateDistPlugin {
    constructor() { }

    // 创建dist文件夹并生成bundle.js和index.html文件
    createDistFile(compilation) {
        const { code, name } = compilation.chunks.get("bundle.js")
        const outputPath = compilation.config.output
        //todo 没有dist时创建dist文件夹
        const hasDir = fs.existsSync(outputPath)
        if (!hasDir) {
            fs.mkdirSync(outputPath)
        }

        //todo 写入文件
        fs.writeFileSync(path.join(outputPath, name), code)

        const coloredPath = changeColor(path.basename(outputPath), 96)
        console.log(`打包成功 请查看${coloredPath}文件夹`)
    }

    run(compilation) {
        const handler = this.createDistFile.bind(this)
        compilation.hooks.SealSync.tapAsync("CreateDistPlugin", handler)
    }
}

module.exports = CreateDistPlugin



