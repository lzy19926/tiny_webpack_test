// 模块工厂,用来给Compilation创建单个模块资源
// 在创建Compilation时通过param注入
const NormalModule = require('./NormalModule')
const JavascriptGenerator = require('./JavaScriptGenerator')
const JavaScriptParser = require('./JavaScriptParser')

// todo
const AddFileSuffixPlugin = require('../plugins/forModuleFactory/AddFileSuffixPlugin')
const CheckFileSuffixPlugin = require('../plugins/forModuleFactory/CheckFileSuffixPlugin')

class ModuleFactory {
    constructor(resolverFactory, config) {

        this.config = config
        this.resolverFactory = resolverFactory
        this.setting = {}
        this.parserCache = new Map()
        this.generatorCache = new Map()
    }

    create(params) {

        const setting = this.prepareModuleSetting(params.type)

        const type = params.type      // 模块类型
        const filePath = params.path  // 模块路径   //todo LazySet改良
        const dependencies = []    // 依赖项
        const loaders = this.config.rules // loaders

        const generator = this.getGenerator(
            setting.generator.Type,
            setting.generator.options
        )
        const parser = this.getParser(
            setting.parser.Type,
            setting.parser.options
        )
        const resolver = this.getResolver(
            setting.resolver.Type,
            setting.resolver.options
        )

        const normalModule = new NormalModule(
            Object.assign({}, {
                type,
                filePath,
                dependencies,
                loaders,
                generator,
                parser,
                resolver
            }))


        // TODO 执行模块构建
        if (normalModule.type === "javascript") {
            normalModule.build()
        }

        return normalModule
    }

    prepareModuleSetting(type) {
        let setting = null
        if (type == "javascript") {
            setting = {
                generator: {
                    Type: "javascript",
                    options: {}
                },
                parser: {
                    Type: "javascript",
                    options: {}
                },
                resolver: {
                    Type: "async",
                    options: {}
                },
            }
        } else if (type == "css") {
            setting = {
                generator: {
                    Type: "css",
                    options: {}
                },
                parser: {
                    Type: "css",
                    options: {}
                },
                resolver: {
                    Type: "async",
                    options: {}
                },
            }
        }

        return setting
    }

    // 用于给module创建需要使用的各类组件
    // resolver的创建和缓存逻辑在resolverFactory中
    getParser(type, options = {}) {

        let cache = this.parserCache
        if (!cache) {
            this.parserCache = new Map()
        }

        let parser = cache.get(options);
        if (!parser) {
            parser = new JavaScriptParser(type, options)
            cache.set(options, parser)
        }

        return parser
    }
    getGenerator(type, options = {}) {

        let cache = this.generatorCache
        if (!cache) {
            this.generatorCache = new Map()
        }

        let generator = cache.get(options);
        if (!generator) {
            generator = new JavascriptGenerator(type, options)
            cache.set(options, generator)
        }

        return generator
    }
    getResolver(type) {
        return this.resolverFactory.get(type)
    }

}


// todo --------这两个逻辑块和读取文件内容,执行loader逻辑需要插件化----------


module.exports = ModuleFactory