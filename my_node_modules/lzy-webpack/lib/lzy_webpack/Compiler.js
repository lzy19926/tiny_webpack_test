/*
Compiler：是一个桥接webpack和插件之间的接口。
它负责读取配置文件、创建编译器实例、启动编译过程等。在webpack启动时，它会被创建一次，并在整个编译生命周期中保持不变。
*/

const Compilation = require('./Compilation')
const ModuleFactory = require('./ModuleFactory')
const { SyncHook } = require('../lzy_tapable/lib/index')
// 插件集
const NodeEnvironmentPlugin = require('../plugins/NodeEnvironmentPlugin')

class Compiler {
    constructor(webpackConfig) {

        this.hooks = {
            // 生命周期钩子
            initSync: new SyncHook(),       // 初始化
            environmentSync: new SyncHook(), // 初始化环境

            // 子模块创建时执行的钩子
            compilation: new SyncHook(),
            moduleFactory: new SyncHook()
        }

        this.config = webpackConfig
        this._lastCompilation = undefined
        this._lastModuleFactory = undefined

        // 文件系统(通过插件注入)
        this.watchFileSystem = undefined      // 文件监视系统
        this.memoFileSystem = undefined       // 内存文件系统
        this.InputFileSystem = undefined      // 缓存文件系统
        this.OutputFileSystem = undefined     // 输出文件系统

        this.init()
    }

    // 初始化
    init() {
        this.registSystemPlugins()
        this.callInitSyncHook()
        this.callEnvironmentSyncHook()
    }

    // 注册系统内置插件(按顺序执行)
    registSystemPlugins() {
        new NodeEnvironmentPlugin().run(this)
    }

    // 执行各Hook回调
    callInitSyncHook() {
        this.hooks.initSync.call()
    }
    callEnvironmentSyncHook() {
        this.hooks.environmentSync.call()
    }

    callCompilationSyncHook() {
        this.hooks.compilation.call()
    }
    callModuleFactorySyncHook() {
        this.hooks.moduleFactory.call()
    }


    // 清除当前Compilation
    cleanUpLastCompilation() {
        if (this._lastCompilation !== undefined) {
            this._lastCompilation = undefined;
        }
    }

    // 清除当前ModuleFactory
    cleanUpLastModuleFactory() {
        if (this._lastModuleFactory !== undefined) {
            this._lastModuleFactory = undefined;
        }
    }

    // 创建单个ModuleFactory
    createModuleFactory() {
        this.cleanUpLastModuleFactory()

        const moduleFactory = new ModuleFactory("resolverFactory", this.config)
        this._lastModuleFactory = moduleFactory
        this.callModuleFactorySyncHook()
        return moduleFactory
    }

    // 创建单个Compilation
    createCompilation() {
        this.cleanUpLastCompilation()

        const params = {
            moduleFactory: this.createModuleFactory()
        }
        const compilation = new Compilation(this, params);
        this._lastCompilation = compilation
        this.callCompilationSyncHook()
        return compilation
    }

    // 执行打包
    compile() {
        const compilation = this.createCompilation()
        compilation.bundle()
    }
}


module.exports = Compiler 