
/**
 * Compilation：代表了一次编译过程，包含了当前的模块资源、代码生成后的结果以及其他有用的信息。
 * 在每次编译过程中，都会创建一个新的Compilation实例，与之前的实例完全相互独立。
 * 通过Compilation对象，可以访问到打包后的模块、Chunk和Module等信息。
 * 
 * Compiler和Compilation的关系是一对多的关系，即一个Compiler实例对应着多个Compilation实例。
 * 在webpack的插件中，我们可以通过compiler来访问webpack的各种事件钩子，
 * 而在这些事件处理函数中又可以获取到当前的Compilation实例，进而对模块进行操作。
 * 
 * 一个compulation对应一个entry  生成一个chunk(bundle就是一个总的chunk)
*/

const { SyncHook, AsyncSeriesHook } = require('../../packages/lzy_tapable/lib/index')
const { changeColor } = require('../progressBar/changeColor')
const { getFileType, addFileSuffix } = require('../utils/index')
// 插件集
const InitProgressBarPlugin = require('../plugins/forCompilation/InitProgressBarPlugin')
const InitCustomPluginsPlugin = require('../plugins/forCompilation/InitCustomPluginsPlugin')
const CaculateSrcFilesPlugin = require('../plugins/forCompilation/CaculateSrcFilesPlugin')
const BuildModuleQueuePlugin = require('../plugins/forCompilation/BuildModuleQueuePlugin')
const BuildManifestPlugin = require('../plugins/forCompilation/BuildManifestPlugin')
const PackModulePlugin = require('../plugins/forCompilation/PackModulesPlugin')
const EnableLibraryPlugin = require('../plugins/librarys/EnableLibraryPlugin')
const InjectENVPlugin = require('../plugins/forCompilation/InjectENVPlugin')
const CreateChunksPlugin = require('../plugins/forCompilation/CreateChunksPlugin')
const CreateDistPlugin = require('../plugins/forCompilation/CreateDistPlugin')

class Compilation {

    constructor(compiler, params) {
        // 初始化生命周期钩子函数队列
        this.hooks = {
            beforeCompileSync: new SyncHook(),
            CompileSync: new SyncHook(["compilation"]),// 手动触发下个回调,支持异步的hook
            ChunkSync: new AsyncSeriesHook(["compilation"]),
            BundleSync: new AsyncSeriesHook(["chunk"]),
            SealSync: new AsyncSeriesHook(["compilation"]),
            afterCompileSync: new SyncHook(),
            beforeDistSync: new SyncHook(),
            afterDistSync: new SyncHook(),
        }

        // 
        this.compiler = compiler
        this.config = compiler.config
        this.resolverFactory = compiler.resolverFactory
        this.moduleFactory = params.moduleFactory
        this.optionApplyer = compiler.optionApplyer
        this.buildProcessCode = ""
        this.buildQueue = []
        this.modules = new Map()  // modules
        this.chunks = new Map()   // chunks  
        this.manifest = new Map() // 依赖图

        // 其他
        this.fileID = -1
        this.progressBar = undefined   // 进度条
        this.dependenciesList = new Set() // 文件列表

    }

    // 注册系统内置插件(按顺序执行)
    registSystemPlugins() {
        // beforeCompile
        new InitCustomPluginsPlugin().run(this)
        new InitProgressBarPlugin().run(this)
        new CaculateSrcFilesPlugin().run(this)
        // Compile
        new BuildModuleQueuePlugin().run(this)
        new BuildManifestPlugin().run(this)
        // Chunk
        new CreateChunksPlugin().run(this)
        // Bundle
        new PackModulePlugin().run(this)
        new EnableLibraryPlugin().run(this)
        new InjectENVPlugin().run(this)

        // Seal
        new CreateDistPlugin().run(this)
    }

    renderProgressBar(...args) {
        this.progressBar.render(...args)
    }

    // 完成构建进度条显示
    renderFinishedBar(tag) {
        switch (tag) {
            case 'bundle':
                this.renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成`, 92));
                break;
            case 'serverBundle':
                this.renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成`, 92));
                break;
            case 'hotUpdate':
                console.log(changeColor(`热模块替换完成`));
                break;
            default:
                this.renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成`, 92));
                break;
        }
    }

    // 调用moduleFactory 构建单个模块资源
    createModule(absolutePath) {

        const path = addFileSuffix(absolutePath)
        const type = getFileType(path) // 检查模块类型
        const params = {
            path,
            type
        }

        const module = this.moduleFactory.create(params)

        if (!module) return

        // 给模块赋值ID
        Object.assign(module, { fileID: this.fileID += 1 })
        //! ------------------------进度显示
        this.dependenciesList.add(absolutePath)
        this.renderProgressBar(`构建${absolutePath}`, { step: 8 })
        this.modules.set(absolutePath, module)
        return module
    }

    // 调用resolver   解析单个模块的路径
    resolveModulePath(path, dirPath) {
        const resolver = this.resolverFactory.get("async")

        let resolvedPath = undefined
        resolver.resolve(path, dirPath, (err, result) => {
            resolvedPath = result.path
        });

        this.renderProgressBar(`解析模块路径:${path}`, { step: 8 })
        return resolvedPath
    }

    // 根据变更的文件 替换需要更新的manifest模块 并生成新的bundle文件(热更新)
    //! 替换manifest模块
    updateModule(path) {
        const module = this.modules.get(path)
        const manifestPart = this.manifest.get(path)

        module.rebuild()
        manifestPart.code = module.originCode

        this.renderFinishedBar('hotUpdate')

        return module
    }

    //-01 初始化
    init(cb) {
        this.registSystemPlugins()
        this.hooks.beforeCompileSync.call()
        cb && cb()
    }

    //-02 构建module  执行loader
    make(cb) {
        this.hooks.CompileSync.call(this)
        cb && cb()
    }

    //-03 根据modules构建chunk
    chunk(cb) {
        this.hooks.ChunkSync.call(this)
        cb && cb()
    }
    //-03 优化代码  将chunk构建为bundle代码
    optimization(cb) {
        for (let [_, chunk] of this.chunks) {
            if (chunk.type == "js") {
                this.hooks.BundleSync.call(chunk)
            }
            chunk.update()
        }

        cb && cb()
    }

    //-04 最终构建产物, 此时已经完成了module的添加和chunk工作
    // 进行配置处理  dist生成
    seal(cb) {
        this.optionApplyer.apply(this)
        this.hooks.SealSync.call(this)
        this.fileID = -1
        cb && cb()
    }

    //! 综合bundle方法(生命周期)
    async bundle() {

        this.init(() => {
            this.make(() => {
                this.chunk(() => {
                    this.optimization(() => {
                        this.seal()
                    })
                })
            })
        })

        this.hooks.afterCompileSync.call() //!执行生命中周期钩子
        this.hooks.beforeDistSync.call() //!执行生命中周期钩子
        this.hooks.afterDistSync.call() //!执行生命中周期钩子
    }

    //! 综合生成chunk
    createChunk() {
        this.init(() => {
            this.make(() => {
                this.chunk(() => {
                    this.optimization()
                })
            })
        })
        return this.chunks
    }

    //! 更新chunk
    rebuildChunk() {
        this.optimization()
        return this.chunks
    }
}

module.exports = Compilation 