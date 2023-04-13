//生产需要打包的文件列表插件
//! (只计算了src下所有的文件数量, 并不是全部需要打包的文件)

const path = require('path')
const fs = require('fs')

class CaculateSrcFilesPlugin {
    constructor() { }

    caculateAllFiles(compiler) {

        let srcFiles = 0

        const needBuild = (suffix) => ["js", "css", "lzy"].indexOf(suffix) !== -1

        //递归计算尾缀为 JS CSS的文件数量
        const countFile = (dirPath) => {
            let filesList = fs.readdirSync(dirPath)

            filesList.forEach((fileName) => {
                let isDir = fileName.split('.').length === 1
                let suffix = fileName.split('.').pop().toLowerCase();
                const absolutePath = dirPath + '\\' + fileName

                if (needBuild(suffix)) {
                    srcFiles += 1
                } else if (isDir) {
                    countFile(absolutePath)
                }
            })
        }

        const srcPath = path.resolve(compiler.config.entry, '..')

        countFile(srcPath)
        // 给进度条设置步数(不准确)
        compiler.progressBar.allStep = srcFiles
    }

    run(compiler) {
        const handler = this.caculateAllFiles.bind(this, compiler)
        compiler.hooks.initSync.tap("CaculateSrcFilesPlugin", handler)
    }
}

module.exports = CaculateSrcFilesPlugin