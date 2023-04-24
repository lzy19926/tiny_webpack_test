// 模块工厂,用来给Compilation创建单个模块资源
// 在创建Compilation时通过param注入

const { AsyncSeriesHook } = require('../lzy_tapable/lib/index')
const AddFileSuffixPlugin = require('../plugins/forModuleFactory/AddFileSuffixPlugin')
const UseCustomLoaderPlugin = require('../plugins/forModuleFactory/UseCustomLoaderPlugin')
const CheckFileSuffixPlugin = require('../plugins/forModuleFactory/CheckFileSuffixPlugin')
const TraverseASTPlugin = require('../plugins/forModuleFactory/TraverseASTPlugin')
const ModuleResultPlugin = require('../plugins/forModuleFactory/ModuleResultPlugin')

class ModuleFactory {
    constructor(resolverFactory, config) {

        this.hooks = {
            beforeCreate: new AsyncSeriesHook(),
            create: new AsyncSeriesHook(["resolveData"]),// 手动触发下个回调,支持异步的hook
            afterCreate: new AsyncSeriesHook()
        }

        this.config = config
        this.resolverFactory = resolverFactory

        this.init()
    }

    init() {
        this.registSystemPlugins()
    }

    //todo  注册系统内置插件
    registSystemPlugins() {
        // beforeCreate


        // create
        new AddFileSuffixPlugin().run(this)
        new UseCustomLoaderPlugin().run(this)
        new CheckFileSuffixPlugin().run(this)
        new TraverseASTPlugin().run(this)
        new ModuleResultPlugin().run(this)
        // afterCreate

    }

    // 初始化resolveData,这个object会持续在hook中流转,用于构建
    initResolveData(params) {
        const { absolutePath } = params

        // const dependencies = new LazySet() // 依赖项
        const dependencies = [] // 依赖项
        const request = absolutePath       // 模块路径
        const resultCode = undefined       // 结果代码
        const processResult = {}           // 中间产物
        const isDone = false               // 流转标记,是否完成模块化构建

        return {
            dependencies,
            request,
            resultCode,
            processResult,
            isDone
        }
    }

    create(params) {
        const resolveData = this.initResolveData(params)

        // 执行插件流转逻辑 
        this.hooks.beforeCreate.callAsync()
        this.hooks.create.call(resolveData)
        this.hooks.afterCreate.callAsync()

        // 读取流转结果,生成模块
        if (resolveData.isDone) {
            return {
                filePath: resolveData.request,
                code: resolveData.resultCode,
                dependencies: resolveData.dependencies
            }
        }

        return
    }

}


module.exports = ModuleFactory