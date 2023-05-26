
// 用于构建Manifest依赖图的插件
class BuildManifestPlugin {
    constructor() { }

    //BFS构建模块队列
    buildModuleQueue(compilation) {

        const queue = compilation.buildQueue
        const manifest = compilation.manifest

        for (let module of queue) {
            const key = module.filePath
            const value = {
                id: module.filePath,
                dependencies: module.depMapping,
                code: module.originCode
            }

            manifest.set(key, value)
        }
    }

    run(compilation) {
        const handler = this.buildModuleQueue.bind(this, compilation)
        compilation.hooks.CompileSync.tap("BuildManifestPlugin", handler)
    }
}

module.exports = BuildManifestPlugin