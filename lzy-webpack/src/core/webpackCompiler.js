const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const { compressByUMinify, compressByUglify } = require('./compressCode')
const { SyncHooks } = require('../tapable/index')
const traverse = require('@babel/traverse').default
const { getProgressCount, renderProgressBar, changeColor } = require('../progressBar/renderProgressBar')

class Webpack {
    constructor(webpackConfig) {
        this.config = webpackConfig
        this.fileID = -1
        this.manifest = null // 细节图
        this.dependenciesList = new Set() // 依赖列表
        this.hooks = { // 初始化生命周期钩子函数队列
            beforeCompileSync: new SyncHooks(),
            afterCompileSync: new SyncHooks(),
            beforeDistSync: new SyncHooks(),
            afterDistSync: new SyncHooks(),
        }
        this.initLifeCycleHooks()
    }

    //初始化webpack生命周期钩子 //! 执行对应的生命周期钩子函数队列
    initLifeCycleHooks() {
        //todo 调用所有plugins上的run方法  挂载plugins上的处理函数到钩子上
        const plugins = this.config.plugins
        if (Array.isArray(plugins)) {
            plugins.forEach((plugin) => {
                plugin.run(this) //传入当前compiler实例
            })
        }
    }
    callBeforeCompileSyncHooks() {
        this.hooks.beforeCompileSync.call()
    }
    callAfterCompileSyncHooks() {
        this.hooks.afterCompileSync.call()
    }
    callBeforeDistSyncHooks() {
        this.hooks.beforeDistSync.call()
    }
    callAfterDistSyncHooks() {
        this.hooks.afterDistSync.call()
    }


    addFileSuffix(path) {
        var index = path.lastIndexOf(".");
        var ext = path.substr(index + 1);

        if (ext.length > 5) {
            path = path + '.js'
        }
        return path
    }

    // 构建文件资源数据
    createAssets(absolutePath) {
        //! 先调用用户的loader
        absolutePath = this.addFileSuffix(absolutePath)
        const fileContent = this.useCustomLoader(absolutePath)

        //非js文件或者lzy不执行
        const isJSFile = /\.js$/.test(absolutePath)
        const isLzyFile = /\.lzy$/.test(absolutePath)
        if (!isJSFile && !isLzyFile) return false
        this.dependenciesList.add(absolutePath)

        renderProgressBar(`构建${absolutePath}`, { step: 8 }) //! ------------------------进度显示
        //! 使用babel/parser将index代码转换为AST语法树  (不支持模块化语法 需要进行配置)
        const ast = parser.parse(fileContent, {
            sourceType: 'module'
        })

        //! 使用babel/traverse遍历AST语法树  将所有import的文件推入dependencise数组
        // 传入的配置对象为visitor,配置钩子函数 不同的钩子会返回不同的语句(import expresstion等)
        // 遍历到对应的语句  就会执行钩子函数  返回语句的信息 (详见AST Exporer)   
        const dependencies = []

        traverse(ast, {
            ImportDeclaration: (path, state) => {
                const depRaletivePath = this.addFileSuffix(path.node.source.value)
                path.node.source.value = depRaletivePath
                dependencies.push(depRaletivePath) //todo 每次遇到import语句  将其文件路径push到依赖数组
                if (/\.css$/.test(depRaletivePath)) {//todo 遇到css的引入 删除语句
                    path.remove()
                }
            },
            CallExpression: (path, state) => {
                const idName = path.node.callee?.name
                if (idName === 'require') {   //todo 每次遇到require语句  将其文件路径push到依赖数组
                    const depRaletivePath = path.node.arguments[0].value
                    dependencies.push(depRaletivePath)
                    if (/\.css$/.test(depRaletivePath)) {//todo 遇到css的引入 删除语句
                        path.remove()
                    }
                }
            }
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
            renderProgressBar(`构建依赖${asset.filePath}`); //! ------------------------进度显示
            const dirname = path.dirname(asset?.filePath) // 获取当前处理文件的绝对路径
            const deps = asset.dependencies
            asset.mapping = {} // 文件的依赖map

            for (let relativePath of deps) {// 遍历文件依赖的文件
                relativePath = this.addFileSuffix(relativePath)
                const absolutePath = path.join(dirname, relativePath)
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
            renderProgressBar(`打包模块${module.filePath}`); //! ------------------------进度显示

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

    // 实现CMD 生成输出到bundle.js的代码
    createOutputCode(modulesStr, tag) {

        // 构建的结果是一个立即执行函数   将modules传进去
        // module中包含了 fn函数(将模块代码包裹并执行的函数) 和模块依赖的mapping 
        // require函数传入(require,module,export) 三个参数
        //todo 也就是模拟了node的require方法和生成模拟module对象
        let result = `
    // -------------------泽亚的webpack---------------------------
        (()=>{
            //todo 传入modules
            var modules = ${modulesStr}


            //TODO 无尾缀的添加尾缀
            function addSuffix(path){
                var index = path.lastIndexOf(".");
                var ext = path.substr(index + 1);
        
                if (ext.length > 5) {
                    path = path + '.js'
                }
                return path
            }
            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(absolutePath){
                const [fn,mapping]  = modules[absolutePath]

                //! 构造fn所需的require函数(loaclRequire 通过相对路径获取绝对路径(id)并执行require)
                const loaclRequire =(relativePath)=>{  
                    relativePath = addSuffix(relativePath)                  
                    return  require(mapping[relativePath])
                }

                //! 构造模拟Node的module对象
                const module = {
                    exports:{}
                }

                //! 将三个参数传入fn并执行
                fn(loaclRequire,module,module.exports)

                //! 将本模块导出的代码返回
                //todo 因为上面fn中传入了module.export,转换后的ES5代码会识别export关键字  
                //todo 并将需要导出的变量添加进module.exports对象中
                return module.exports
            }

            //! 执行require(entry)入口模块
             require(${JSON.stringify(this.config.entry)})
            
        })();`

        //! ------------------------完成构建进度显示
        switch (tag) {
            case 'bundle':
                renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成`, 92));
                break;
            case 'serverBundle':
                renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成,访问 ${changeColor(' http://localhost:8080', 96)} \n\n`, 92));
                break;
            case 'hotUpdate':
                console.log(changeColor(`热模块替换完成`));
                break;
            default:
                renderProgressBar(changeColor(`√`, 92), { done: true })
                console.log(changeColor(`构建完成`, 92));
                break;
        }

        return result
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
            const absolutePath = path.join(dirname, relativePath)
            asset.mapping[relativePath] = absolutePath //通过相对路径和绝对路径匹配 构建资源依赖图
        }

        return asset
    }

    // 替换单个manifest模块(热更新)
    updateManifest(manifestPart) {
        const target = this.manifest.find((part) => {
            return manifestPart.filePath === part.filePath
        })
        target.code = manifestPart.code
        target.dependencies = manifestPart.dependencies
        target.mapping = manifestPart.mapping
    }

    // 根据变更的文件 替换新manifest模块 并生成新的bundle文件(热更新)
    createNewBundle(pathList) {
        pathList.forEach((changedFile) => {
            const manifestPart = this.createManifestPart(changedFile)
            this.updateManifest(manifestPart)
        })
        const modulesStr = this.createModules(this.manifest)
        const bundleCode = this.createOutputCode(modulesStr, 'hotUpdate')

        return bundleCode
    }

    //! 构建模块 生成bundle代码
    buildModules(tag) {
        const manifest = this.createManifest(this.config.entry)  // 创建文件依赖图(Manifest)
        this.manifest = manifest
        const modules = this.createModules(manifest) // 生成modules
        const result = this.createOutputCode(modules, tag)// 打包模块生成bundle代码

        return result
    }

    //! 处理代码后续配置
    async handleOptions(result) {
        //todo hot为true时进行热更新
        if (this.config.hot) {

        }
        //todo 生产模式进行代码压缩  默认不压缩
        if (this.config.mode === 'production') {
            // result = compressByUglify(result)
            result = compressByUMinify(result)
        }
        return result
    }

    //! 综合bundle方法(生命周期)
    async bundle() {

        getProgressCount(this.config.entry) // 计算进度条

        this.callBeforeCompileSyncHooks() //!执行生命中周期钩子
        const outputCode = this.buildModules(this.config.entry, 'bundle')
        this.callAfterCompileSyncHooks() //!执行生命中周期钩子

        const nextResult = await this.handleOptions(outputCode)

        this.callBeforeDistSyncHooks() //!执行生命中周期钩子
        this.outputDist(nextResult)   // 生成dist文件夹
        this.callAfterDistSyncHooks() //!执行生命中周期钩子

    }
}

module.exports = Webpack 