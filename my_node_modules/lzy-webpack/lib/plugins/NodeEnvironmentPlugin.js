// 给Compiler注入Node环境, 在Hook的environment阶段执行
const fs = require('fs')
const path = require('path')
const { DirectoryWatcher } = require('lzy-watchpack')
const MemoryFileSystem = require("memory-fs");

class NodeEnvironmentPlugin {
    constructor() { }

    initNodeEnv(compiler) {
        const srcPath = path.resolve(compiler.config.entry, '..')
        const watcher = new DirectoryWatcher({
            directoryList: [srcPath],
            poll: 1000
        })

        compiler.watchFileSystem = watcher// 文件监视系统
        compiler.memoFileSystem = new MemoryFileSystem()   // 内存文件系统
        compiler.InputFileSystem = fs
        compiler.OutputFileSystem = fs
    }

    //todo 将initNodeEnv方法注册到webpack的environmentSync钩子队列  打包时执行 
    run(compiler) {
        const handler = this.initNodeEnv.bind(this, compiler)
        compiler.hooks.environmentSync.tap("NodeEnvironmentPlugin", handler)
    }
}

module.exports = NodeEnvironmentPlugin