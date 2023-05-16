

class CreateManifestPlugin {
    constructor() { }

    createManifest(compilation) {

        //1 通过入口文件构建文件资源
        const entry = this.compilation.config.entry
        const mainAsset = this.compilation.createAssets(entry)

        //2 使用队列循环方式构建依赖图(BFS遍历 使用createAssets处理每个js文件)
        const queue = [mainAsset]

        for (const asset of queue) {
            this.renderProgressBar(`构建依赖${asset.filePath}`); //! ------------------------进度显示
            const dirname = path.dirname(asset?.filePath) // 获取当前处理文件的绝对路径
            const deps = asset.dependencies
            asset.mapping = {} // 文件的依赖map

            for (let relativePath of deps) {// 遍历文件依赖的文件
                const absolutePath = this.compilation.preHandleRaletivePath(relativePath, dirname) // 预处理路径

                asset.mapping[relativePath] = absolutePath //通过相对路径和绝对路径匹配 构建资源依赖图

                const hasSameAsset = queue.some((module) => {
                    return module.filePath === absolutePath
                })
                if (hasSameAsset) continue //重复模块不执行

                const childAsset = this.createAssets(absolutePath) //通过绝对路径构建子文件资源
                if (childAsset) {//处理好的js资源推入数组 (childAsset会进入下个循环继续执行)
                    queue.push(childAsset)
                }
            }
        }

        this.fileID = -1
        this.Manifast = queue
        return queue
    }

    run(compilation) {
        const handler = this.createManifest.bind(this, compilation)
        compilation.hooks.CompileSync.tap("CreateManifestPlugin", handler)
    }
}