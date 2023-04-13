const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const types = require('@babel/types') // 用于创建AST节点
const { SyncHook } = require('../lzy_tapable/lib/index')
const traverse = require('@babel/traverse').default
const { changeColor } = require('../progressBar/changeColor')
const { compressByUMinify, compressByUglify, justBeautifly } = require('./compressCode')
const { importStatic } = require('./importStatic')

// 插件集
const CaculateSrcFilesPlugin = require('../plugins/CaculateSrcFilesPlugin')
const InitCustomPluginsPlugin = require('../plugins/InitCustomPluginsPlugin')
const NodeEnvironmentPlugin = require('../plugins/NodeEnvironmentPlugin')
const InitProgressBarPlugin = require('../plugins/InitProgressBarPlugin')


// 模块的加载循序为：_browser+mjs > module > browser+cjs > main_>deno这个加载顺序是大部分构建工具默认的加载顺序
function findEntryFromExportsObj(exportObj) {

    let exportPath = ''

    if (typeof exportObj === 'string') {
        exportPath = exportObj
    }
    // 如果是数组,取最后一个默认值(需要修改)
    else if (Array.isArray(exportObj)) {
        exportPath = exportObj[exportObj.length - 1]
    }
    // 有broswer直接为字符串或分为require和default两种情况
    else if (typeof exportObj === 'object') {

        const broswer = typeof exportObj?.browser === 'string'
            ? exportObj?.browser
            : void 0
        const browserRequire = exportObj?.browser?.require
        const browserDefault = exportObj?.browser?.default

        const node = typeof exportObj?.default === 'string'
            ? exportObj?.default
            : void 0
        const nodeRequire = exportObj?.default?.require
        const nodeDefault = exportObj?.default?.default

        const deno = typeof exportObj?.deno === 'string'
            ? exportObj?.deno
            : void 0
        const denoRequire = exportObj?.deno?.require
        const denoDefault = exportObj?.deno?.default

        exportPath = broswer
            || browserRequire
            || browserDefault
            || node
            || nodeRequire
            || nodeDefault
            || deno
            || denoRequire
            || denoDefault
    }


    return exportPath
}

// 层层往上翻查找package.json文件,获取dep文件夹路径,
function checkPackageJson(depName, rootPath) {

    let restPath = depName // 当前目录
    let packageJSON;
    let depDirPath;

    // 检查当前目录是否有packageJson,给package.json赋值
    const checkLoop = (restPath) => {
        if (!packageJSON) {
            const pDir = path.join(rootPath, '/node_modules', restPath)
            const packageJsonPath = path.join(pDir, 'package.json')
            if (fs.existsSync(packageJsonPath)) {
                packageJSON = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
                depDirPath = pDir
                return true
            }
        }
        return false
    }

    while (restPath.indexOf('/') !== -1) {
        if (checkLoop(restPath)) break

        let lastP = restPath.lastIndexOf('/')
        restPath = restPath.slice(0, lastP)
    }

    // 从剩下的主目录找package.json
    checkLoop(restPath)

    return [packageJSON, restPath, depDirPath]
}

class Compiler {
    constructor(webpackConfig) {
        // 初始化生命周期钩子函数队列
        this.hooks = {
            initSync: new SyncHook(),
            environmentSync: new SyncHook(),
            beforeCompileSync: new SyncHook(),
            afterCompileSync: new SyncHook(),
            beforeDistSync: new SyncHook(),
            afterDistSync: new SyncHook(),
        }

        // 文件系统(通过插件注入)
        this.watchFileSystem = undefined      // 文件监视系统
        this.memoFileSystem = undefined       // 内存文件系统
        this.InputFileSystem = undefined      // 缓存文件系统
        this.OutputFileSystem = undefined     // 输出文件系统

        // 其他
        this.config = webpackConfig
        this.fileID = -1
        this.fileList = []             // 需要打包的文件列表
        this.progressBar = undefined   // 进度条

        this.manifest = null // 细节图
        this.dependenciesList = new Set() // 依赖列表

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
        new InitCustomPluginsPlugin().run(this)
        new InitProgressBarPlugin().run(this)
        new CaculateSrcFilesPlugin().run(this)
        new NodeEnvironmentPlugin().run(this)
    }

    // 执行各Hook回调
    callInitSyncHook() {
        this.hooks.initSync.call()
    }
    callEnvironmentSyncHook() {
        this.hooks.environmentSync.call()
    }
    callBeforeCompileSyncHook() {
        this.hooks.beforeCompileSync.call()
    }
    callAfterCompileSyncHook() {
        this.hooks.afterCompileSync.call()
    }
    callBeforeDistSyncHook() {
        this.hooks.beforeDistSync.call()
    }
    callAfterDistSyncHook() {
        this.hooks.afterDistSync.call()
    }

    renderProgressBar(...args) {
        this.progressBar.render(...args)
    }

    // 从mode_modules中找到对应的入口文件路径
    //todo 包一般有两个入口  main和browser, main是通用入口(有可能有node模块),broswer是浏览器入口
    // 模块的加载循序为：_browser+mjs > module > browser+cjs > main_这个加载顺序是大部分构建工具默认的加载顺序
    getNpmPackageEntry(depName) {

        const rootPath = this.config.rootPath
        // 层层往上翻查找获取package.json文件(倒序查找),并获取需要的path
        const [packageJSON, restPath, depDirPath] = checkPackageJson(depName, rootPath)

        //! dep可能是'react', 'react/client', 需要从package.json的export属性中找到对应的路径
        const subName = depName.replace(restPath, '')

        // 没有exports对象时 分为三种情况
        if (!packageJSON.exports) {
            const isFileWithoutSuffix = fs.existsSync(path.join(depDirPath, subName) + '.js') // 无.js尾缀文件
            const exportFromDirectory = !isFileWithoutSuffix && !packageJSON.main             // 从文件夹index.js获取
            const exportFromMainProp = packageJSON.main                                       // 从main获取

            if (isFileWithoutSuffix) return path.join(depDirPath, subName) + '.js'
            if (exportFromDirectory) return path.join(depDirPath, 'index.js')
            if (exportFromMainProp) return path.join(depDirPath, packageJSON.main)
        }
        // 有exports对象时主要从exports对象中查找入口 分为四种情况
        else {
            // 分为子模块和主模块
            let exportObj = subName
                ? packageJSON.exports['.' + subName]
                : packageJSON.exports['.']

            // 如果没有从obj中找到,使用main兜底
            let raletivePath = findEntryFromExportsObj(exportObj)

            return raletivePath
                ? path.join(depDirPath, raletivePath)
                : path.join(depDirPath, packageJSON.main)
        }
    }

    // 添加.js后缀
    addFileSuffix(path) {
        if (path[0] !== '.' && path[1] !== ':') return path

        var index = path.lastIndexOf(".");
        var ext = path.substr(index + 1);

        if (ext.length > 5) {
            path = path + '.js'
        }
        return path
    }

    // 预处理ast解析来的path
    preHandleRaletivePath(relativePath, dirname) {
        // 检查文件是否存在,不存在则去掉js后缀检查文件夹
        let absolutePath = path.join(dirname, relativePath)

        if (relativePath[0] === '.') {
            let isFile = fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()
            let isFileWithoutSuffix = !isFile && fs.existsSync(absolutePath + '.js') && fs.statSync(absolutePath + '.js').isFile()
            let isDir = !isFile && !isFileWithoutSuffix && fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()

            if (isFile) {
                absolutePath = absolutePath
            }
            else if (isFileWithoutSuffix) {
                absolutePath = absolutePath + '.js'
            }
            else if (isDir) {
                absolutePath = path.join(absolutePath, 'index.js')
            }

        }
        else {
            absolutePath = this.getNpmPackageEntry(relativePath)
        }

        return absolutePath
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

    // 构建文件资源数据
    createAssets(absolutePath) {
        //! 先调用用户的loader
        absolutePath = this.addFileSuffix(absolutePath)
        const fileContent = this.useCustomLoader(absolutePath)

        //非js,cjs,mjs,jsx文件或者lzy不执行
        const isJSFile = /\.js$/.test(absolutePath)
            || /\.ts$/.test(absolutePath)
            || /\.cjs$/.test(absolutePath)
            || /\.mjs$/.test(absolutePath)
            || /\.jsx$/.test(absolutePath)
            || /\.tsx$/.test(absolutePath)
        const isLzyFile = /\.lzy$/.test(absolutePath)
        if (!isJSFile && !isLzyFile) return console.error('只能加载js,ts,cjs,mjs,jsx,tsx类型文件')
        this.dependenciesList.add(absolutePath)

        this.renderProgressBar(`构建${absolutePath}`, { step: 8 }) //! ------------------------进度显示
        //! 使用babel/parser将index代码转换为AST语法树  (不支持模块化语法 需要进行配置)
        const ast = parser.parse(fileContent, {
            sourceType: 'module'
        })

        //! 使用babel/traverse遍历AST语法树  将所有import的文件推入dependencise数组
        // 传入的配置对象为visitor,配置钩子函数 不同的钩子会返回不同的语句(import expresstion等)
        // 遍历到对应的语句  就会执行钩子函数  返回语句的信息 (详见AST Exporer)   
        const dependencies = []

        traverse(ast, {
            ImportDeclaration: (path, state) => {//todo 遇到import语句  将文件路径push到依赖数组(预处理path)
                const depRaletivePath = path.node.source.value

                dependencies.push(depRaletivePath)
                if (/\.css$/.test(depRaletivePath)) {
                    path.remove()
                }
            },
            CallExpression: (path, state) => {//todo 遇到require语句  将文件路径push到依赖数组(预处理path)
                const idName = path.node.callee?.name
                if (idName === 'require') {
                    let depRaletivePath = path.node.arguments[0].value

                    dependencies.push(depRaletivePath)
                    if (/\.css$ /.test(depRaletivePath)) {
                        path.remove()
                    }
                }
            },
            VariableDeclarator: (path, state) => {//todo 遇到importStatic语句  (处理path,替换AST)
                const isImportStatic =
                    path.node.init?.type === 'CallExpression' &&
                    path.node.init?.callee?.name === 'importStatic'

                if (isImportStatic) {
                    const key = path.node.id.name
                    const value = path.node.init.arguments[0].value
                    const nextValue = importStatic(value) // 删除多余public
                    const varName = types.identifier(key) // 变量名
                    const init = types.stringLiteral(nextValue);// 变量值 类型为string
                    const varDec = types.variableDeclarator(varName, init) // 创建变量key = value
                    const defaultVar = types.variableDeclaration('var', [varDec]) // 写入变量声明 var 
                    ast.program.body.unshift(defaultVar) //添加到文件Ast中
                    path.remove()//删除原句
                }
            },
        })

        //!使用babel/core 转化ast为ES5语法 支持浏览器运行
        // 三号参数配置babel转化的插件(与webpack类似)(preset是使用的插件集合)
        const es5Code = babel.transformFromAstSync(ast, null, {
            presets: ['@babel/preset-env']
        })

        return {
            fileID: this.fileID += 1,
            filePath: absolutePath,
            code: es5Code.code,
            dependencies
        }
    }

    // 使用自定义loader  
    useCustomLoader(absolutePath) {
        const fileContent = fs.readFileSync(absolutePath, 'utf-8')
        const rules = this.config.rules

        if (!rules) return fileContent

        // 遍历rules 如果尾缀符合  则调用其中的loader 处理字符串
        let res = fileContent
        rules.forEach((rule) => {
            if (rule.test.test(absolutePath)) {
                rule.use.forEach((loader) => {
                    res = loader(res)
                })
            }
        })

        return res
    }

    //构建文件依赖图
    createManifest(entry) {

        //1 通过入口文件构建文件资源
        const mainAsset = this.createAssets(entry)

        //2 使用队列循环方式构建依赖图(遍历+递归 使用createAssets处理每个js文件)
        const queue = [mainAsset]

        for (const asset of queue) {
            this.renderProgressBar(`构建依赖${asset.filePath}`); //! ------------------------进度显示
            const dirname = path.dirname(asset?.filePath) // 获取当前处理文件的绝对路径
            const deps = asset.dependencies
            asset.mapping = {} // 文件的依赖map

            for (let relativePath of deps) {// 遍历文件依赖的文件
                if (relativePath === '../ButtonBase.js') {
                    debugger
                }
                const absolutePath = this.preHandleRaletivePath(relativePath, dirname) // 预处理路径

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

    // 通过依赖图生成模块对象集合
    createModules(manifest) {

        let modulesStr = '';
        // 构建每个module为键值对 并添加进modules对象(所有资源都以字符串形式构建)
        //todo 注意  (1.处理模块为键值对 绝对路径为key 值保存模块的code和mapping)
        //todo 2. 模块的code应放在一个函数里 因为每个模块的code中使用了require,exports两个API 需要传入
        //todo 3 文件中的依赖是相对路径  需要使用绝对路径
        manifest.forEach(module => {
            this.renderProgressBar(`打包模块${module.filePath}`); //! ------------------------进度显示

            const key = JSON.stringify(module.filePath)
            const mapping = JSON.stringify(module.mapping)
            const code = `(require,module,exports)=>{
            ${module.code}
        } `

            // 单个模块资源
            const modulesPart = `${key}:[\n ${code},\n ${mapping} \n ],\n`
            modulesStr += modulesPart
        })

        return `{${modulesStr}}`
    }

    // 生成输出到bundle.js的代码(兼容各种模块化规范)
    createOutputCode(modulesStr) {

        // 检查规范名是否合法(默认为CMD)
        const moduleType = ['AMD', 'UMD', 'CommonJS', 'CMD', 'ESM']
            .find(t => t === this.config.module)
            || 'CMD'

        // 使用不同的模块化规范代码
        let result = this.injectENV()
        switch (moduleType) {
            case "UMD":
                result += this.createCode_UMD(modulesStr);
                break;
            case "CMD":
                result += this.createCode_CMD(modulesStr);
                break;
            default:
                result += this.createCode_CMD(modulesStr);
                break;
        }

        //todo ------------动态import相关代码   暂时不开发----------------
        {
            let requireEnsureStr = `
            
        `
            // 保存了所有已被加载的异步模块
            var installedChunks = {}

            function requireEnsure(chunkId) {  // 这里的chunkId就是absolutePath
                var promises = []
                var installedChunkData = installedChunks[chunkId];

                if (installedChunkData !== 0) { // 0表示已经被加载

                    if (installedChunkData) {
                        promises.push(installedChunkData[2]);
                    } else {

                        // 为这个chunk创建一个promise
                        // 将该promise的resolve,reject保存到installedChunks中
                        var promise = new Promise(function (resolve, reject) {
                            installedChunkData = [resolve, reject];
                            installedChunks[chunkId] = installedChunkData
                        });

                        // promises数组里添加这个chunk对应的promise
                        // 并将promise也保存到installedChunks里 
                        // 一个chunk的结构: [resolve,reject,promise]
                        installedChunkData[2] = promise
                        promises.push(promise)
                    }
                }

                return Promise.all(promises)
            }

            function webpackJsonpCallback(moreModules) {
                // 收集所有异步模块中的resolve方法
                Object.keys(installedChunks).forEach((moduleId) => {
                    //! 取出后如何将其动态添加到模块对象？
                })
            }
        }

        return result
    }
    // 给输出的代码注入环境变量
    injectENV() {
        const mode = this.config.mode
        const isValidateMode = ['production', 'development', 'none'].some((i) => i == mode)
        if (!isValidateMode) { console.warn('请输入正确的mode配置,"production"|"development"|"none"') }

        return `
//TODO 注入环境变量
const process = {env:{NODE_ENV:'${mode}'}};
        `
    }

    createCode_CMD(modulesStr) {
        // 构建的结果是一个立即执行函数   将modules传进去
        // module中包含了 fn函数(将模块代码包裹并执行的函数) 和模块依赖的mapping 
        // require函数传入(require,module,export) 三个参数
        //todo 也就是模拟了node的require方法和生成模拟module对象
        return `
        // -------------------阳九的webpack---------------------------
            (()=>{
                //todo 传入modules
                var modules = ${modulesStr}
                
                //todo 这里需要一个module缓存
                var modulesCache = {};
    
                //todo 创建require函数 获取modules的函数代码和mapping对象
                function require(absolutePath){
                    const [fn,mapping]  = modules[absolutePath]
    
                    //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
                    const loaclRequire =(relativePath)=>{  
                        return  require(mapping[relativePath])
                    }
    
                    //!查看缓存中是否有模块 构造模拟Node的module对象  (多个模块同时引用一个module   都需要从缓存中拿取  否则会创建一个新的module 导致引用不一致)
                    var cachedModule = modulesCache[absolutePath];
                    if (cachedModule !== undefined) return cachedModule.exports;
    
                    //! 如果模块不存在  创建一个新的module到缓存
                    var module = modulesCache[absolutePath] = {
                        exports: {}
                    };
    
                    //! 将三个参数传入fn并执行
                    fn.apply(null, [loaclRequire, module, module.exports])
    
                    //! 将本模块导出的代码返回
                    //todo 上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
                    return module.exports
                }


    
                //! 执行require(entry)入口模块
                 var entryModule = require(${JSON.stringify(this.config.entry)})

                 //! 模拟UMD模块化规范,将入口模块导出？？
                   try{
                    module.exports = entryModule
                    }catch(err){
                        
                    }
               
            })();`
    }

    createCode_UMD(modulesStr) {

        if (!this.config.umdName) {
            console.error("使用了UMD规范,请配置'umdName'属性以挂载到window上")
        }

        return `
        // -------------------阳九的webpack---------------------------
        //! 模拟UMD模块化规范,将入口模块导出？？   
        ((root, factory) => {
                if (typeof define === 'function' && define.amd) {
                  define(factory);
                } else if (typeof exports === 'object') {
                  module.exports = factory();
                } else {
                  root['${this.config.umdName}'] = factory().default; // 将factory导出的对象挂载到window上
                }
              
              })(this,()=>{
                //todo 传入modules
                var modules = ${modulesStr}
                
                //todo 这里需要一个module缓存
                var modulesCache = {};
    
                //todo 创建require函数 获取modules的函数代码和mapping对象
                function require(absolutePath){
                    const [fn,mapping]  = modules[absolutePath]
    
                    //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
                    const loaclRequire =(relativePath)=>{  
                        return  require(mapping[relativePath])
                    }
    
                    //!查看缓存中是否有模块 构造模拟Node的module对象  (多个模块同时引用一个module   都需要从缓存中拿取  否则会创建一个新的module 导致引用不一致)
                    var cachedModule = modulesCache[absolutePath];
                    if (cachedModule !== undefined) return cachedModule.exports;
    
                    //! 如果模块不存在  创建一个新的module到缓存
                    var module = modulesCache[absolutePath] = {
                        exports: {}
                    };
    
                    //! 将三个参数传入fn并执行
                    fn.apply(null, [loaclRequire, module, module.exports])
    
                    //! 将本模块导出的代码返回
                    //todo 上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
                    return module.exports
                }



                //! 执行require(entry)入口模块
                 return require(${JSON.stringify(this.config.entry)})               
            });`
    }

    // 创建dist文件夹并生成bundle.js和index.html文件
    outputDist(result) {
        //todo 没有dist时创建dist文件夹
        const hasDir = fs.existsSync(this.config.output)
        if (!hasDir) {
            fs.mkdirSync(this.config.output)
        }

        //todo 写入文件
        fs.writeFileSync(this.config.output + `/bundle.js`, result)

        const coloredPath = changeColor(path.basename(this.config.output), 96)
        console.log(`打包成功 请查看${coloredPath}文件夹`)
    }

    // 构建单个Manifest模块 (热更新)
    createManifestPart(p) {
        //构建文件资源
        const asset = this.createAssets(p)
        const dirname = path.dirname(asset?.filePath) // 获取当前处理文件的绝对路径
        asset.mapping = {} // 文件的依赖map

        for (const relativePath of asset.dependencies) {// 遍历文件依赖的文件
            // const absolutePath = path.join(dirname, relativePath)
            const absolutePath = this.preHandleRaletivePath(relativePath, dirname)
            asset.mapping[relativePath] = absolutePath //通过相对路径和绝对路径匹配 构建资源依赖图
        }

        return asset
    }

    //! 替换需要的manifest模块(热更新)
    updateManifest(assetsQueue) {
        assetsQueue.forEach(asset => {
            const target = this.manifest.find((part) => asset.filePath === part.filePath)
            target.code = asset.code
            target.dependencies = asset.dependencies
            target.mapping = asset.mapping
        })
    }

    // 通过变更的文件  找到相关需要重新构建的文件(set去重)
    getNeedUpdateFiles(path) {
        var importors = [path]
        this.manifest.forEach(asset => {
            Object.keys(asset.mapping).forEach(p => {
                if (asset.mapping[p] === path) {
                    importors.push(asset.filePath)
                }
            })
        })

        return Array.from(new Set(importors))
    }

    // 根据变更的文件 替换需要更新的manifest模块 并生成新的bundle文件(热更新)
    createNewBundle(path) {
        const needUpdateFiles = this.getNeedUpdateFiles(path)
        const assetsQueue = needUpdateFiles.map(p => this.createManifestPart(p))
        this.updateManifest(assetsQueue)

        const modulesStr = this.createModules(this.manifest)
        const bundleCode = this.createOutputCode(modulesStr)
        this.renderFinishedBar('hotUpdate')
        return bundleCode
    }

    //! 构建模块 生成bundle代码
    createBundle(tag) {
        const manifest = this.createManifest(this.config.entry)  // 创建文件依赖图(Manifest)
        this.manifest = manifest
        const modulesStr = this.createModules(manifest) // 生成modules
        const bundleCode = this.createOutputCode(modulesStr)// 打包模块生成bundle代码
        this.renderFinishedBar(tag)
        return bundleCode
    }

    //! 处理代码后续配置
    async handleOptions(result) {
        //todo hot为true时进行热更新
        if (this.config.hot) {

        }
        //todo 生产模式进行代码压缩  默认不压缩
        if (this.config.mode === 'production') {
            result = compressByUglify(result)
        } else if (this.config.mode === 'development') {
            // result = justBeautifly(result)
            result = result
        } else {
            result = justBeautifly(result)
        }

        return result
    }

    //! 综合bundle方法(生命周期)
    async bundle() {

        this.callBeforeCompileSyncHook() //!执行生命中周期钩子
        const outputCode = this.createBundle('bundle')
        this.callAfterCompileSyncHook() //!执行生命中周期钩子

        const nextResult = await this.handleOptions(outputCode)
        this.callBeforeDistSyncHook() //!执行生命中周期钩子
        this.outputDist(nextResult)   // 生成dist文件夹
        this.callAfterDistSyncHook() //!执行生命中周期钩子

    }

}

module.exports = Compiler 