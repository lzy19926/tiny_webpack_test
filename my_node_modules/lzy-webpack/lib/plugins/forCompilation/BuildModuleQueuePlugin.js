
// 用于通过入口给Compilation构建模块队列插件
class BuildModuleQueuePlugin {
    constructor() { }

    //BFS构建模块队列
    buildModuleQueue(compilation) {

        const queue = compilation.buildQueue
        const entry = compilation.config.entry

        //1 通过入口文件构建文件资源
        const mainModule = compilation.createModule(entry)
        queue.push(mainModule)
        //2 使用队列循环方式构建依赖图(BFS遍历 使用createModule处理每个js文件)
        for (const module of queue) {
            compilation.renderProgressBar(`构建依赖${module.filePath}`); //! ------------------------进度显示
            const depMapping = module.depMapping

            for (let [_, absolutePath] of depMapping) {
                const hasSameModule = queue.some((module) => {
                    return module.filePath === absolutePath
                })

                if (hasSameModule) continue //重复模块不执行

                const childModule = compilation.createModule(absolutePath) //通过绝对路径构建子文件资源

                if (childModule) {//处理好的js资源推入数组 (childModule会进入下个循环继续执行)
                    queue.push(childModule)
                }
            }
        }

    }

    run(compilation) {
        const handler = this.buildModuleQueue.bind(this)
        compilation.hooks.CompileSync.tap("BuildModuleQueuePlugin", handler)
    }
}

module.exports = BuildModuleQueuePlugin