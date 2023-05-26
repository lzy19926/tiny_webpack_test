// 通过enhanced-resolve库创建Resolver类, 用于进行路径解析
// 缓存Resolver
// 在Compiler中挂载,一般交给moduleFacory去使用


const Factory = require('../../packages/lzy_enhanced-resolve/lib/index')
const { SyncWaterfallHook } = require('../../packages/lzy_tapable/lib/index')

class ResolverFactory {
    constructor(compiler) {
        // 生命周期钩子
        this.hooks = {
            getResolver: new SyncWaterfallHook(),   // 获取时执行
            createResolver: new SyncWaterfallHook() // 创建时执行
        }
        this.compiler = compiler
        this.cache = new Map() // 缓存处理
    }

    get(type = "async") {
        const cachedResolver = this.cache.get(type)
        if (cachedResolver) return cachedResolver

        const newResolver = this._create();
        this.cache.set(type, newResolver)

        this.hooks.getResolver.call()
        return newResolver
    }

    _create() {
        const defaultOptions = {
            descriptionFiles: ["package.json"],
            conditionNames: ["node"],
            extensions: [".js", ".json", ".node"],
            indexFiles: ["index"],
            mainFields: ["main"],
            fileSystem: this.compiler.InputFileSystem,
            rootPath: this.compiler.config.rootPath //! 项目rootPath
        }

        const resolver = Factory.createResolver(defaultOptions)

        this.hooks.createResolver.call()
        return resolver
    }

}

module.exports = ResolverFactory
