const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const { compress } = require('./compressCode')
const { SyncHooks } = require('../tapable/index')
const traverse = require('@babel/traverse').default
const { getProgressCount, renderProgressBar, changeColor } = require('../progressBar/renderProgressBar')


class Webpack {
    constructor(webpackConfig) {
        this.config = webpackConfig
        this.fileID = -1
        this.Manifast = null // 细节图
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



    // 构建文件资源数据
    createAssets(absolutePath) {
        //! 调用loader
        const fileContent = this.useLoader(absolutePath)

        //非js文件不执行
        const suffix = absolutePath.split('.').pop()
        if (suffix !== 'js') return

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
            ImportDeclaration: (childAst, state) => {
                const depRaletivePath = childAst.node.source.value
                dependencies.push(depRaletivePath) //todo 每次遇到import语句  将其文件路径push到依赖数组
            }
        })


        //!使用babel/core 转化ast为ES5语法 支持浏览器运行
        // 三号参数配置babel转化的插件(与webpack类似)(preset是使用的插件集合)
        const es5Code = babel.transformFromAstSync(ast, null, {
            presets: ['@babel/preset-env'],
            plugins: []
        })

        this.fileID += 1
        // 返回处理好的文件路径   es5代码  依赖文件
        return {
            fileID: this.fileID,
            filePath: absolutePath,
            code: es5Code.code,
            dependencies
        }

    }

    // 使用loader  
    useLoader(absolutePath) {
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

        // todo  这里需要进行模块比较  重复的模块不推入
        //2 使用队列循环方式构建依赖图(遍历+递归 使用createAssets处理每个js文件)
        const queue = [mainAsset]

        for (const asset of queue) {
            const dirname = path.dirname(asset?.filePath) // 获取当前处理文件的绝对路径
            asset.mapping = {} // 文件的依赖map

            renderProgressBar(`构建依赖${asset.filePath}`); //! ------------------------进度显示

            asset.dependencies.forEach(relativePath => {// 遍历文件依赖的文件(import)

                const absolutePath = path.join(dirname, relativePath) // 获取import文件的绝对路径
                const childAsset = this.createAssets(absolutePath) //! 通过绝对路径构建子文件资源

                asset.mapping[relativePath] = absolutePath //!通过相对路径和绝对路径匹配（ID） 构建资源依赖图

                // 处理好的js资源推入数组 非JS不执行 (childAsset会进入下个循环继续执行)
                if (childAsset) {
                    queue.push(childAsset)
                }
            })
        }

        this.fileID = -1  //生成依赖图后重置id

        this.Manifast = queue

        return queue
    }

    // 通过依赖图生成模块对象集合
    createModules(manifest) {

        let modulesStr = '';
        // 构建每个module为键值对 并添加进modules对象(所有资源都以字符串形式构建)
        //todo 注意  (1.处理模块为键值对 id为key 值保存模块的code和mapping)
        //todo 2. 模块的code应放在一个函数里 因为每个模块的code中使用了require,exports两个API 需要传入
        //todo 3 因为打包使用了相对路径  不准确 需要添加id来更准确的查找模块
        manifest.forEach(module => {

            renderProgressBar(`打包模块${module.filePath}`); //! ------------------------进度显示

            const key = JSON.stringify(module.filePath)
            const code = `function(require,module,exports){
            ${module.code}
        } `
            const mapping = JSON.stringify(module.mapping)

            // 单个模块资源
            const modulesPart = `${key}:[\n ${code},\n ${mapping} \n ],\n`
            modulesStr += modulesPart
        })

        return `{${modulesStr}}`
    }

    // 实现CMD 生成输出到bundle.js的代码
    createOutputCode(modulesStr) {

        // 构建的结果是一个立即执行函数   将modules传进去
        // module中包含了 fn函数(将模块代码包裹并执行的函数) 和模块依赖的mapping 
        // 在require函数中 因为要执行fn函数  需要传入fn(require,module,export) 三个参数
        //todo 也就是模拟了node的require方法和生成模拟module对象
        let result = `
    // -------------------泽亚的webpack---------------------------
        (function(){
            //todo 传入modules
            var modules = ${modulesStr}

            //todo 创建require函数 获取modules的函数代码和mapping对象
            function require(raletivePath){

                //! 通过id获取module 解构出代码执行函数fn和mapping
                const [fn,mapping]  = modules[raletivePath]

                //! 构造fn所需的三个参数 构建自己的module对象
                //todo loaclRequire 通过相对路径获取绝对路径(id)并执行require
                const loaclRequire =(relativePath)=>{                    
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
        renderProgressBar(changeColor(`√`, 92), { done: true })
        console.log(changeColor(`构建完成,访问 ${changeColor(' http://localhost:8080', 96)} \n\n`, 92));
        return result
    }

    // 热更新
    hotUpdate(result) {

        //todo 用于热更新的代码
        const hotReplaceCode = `
         //todo 热模块替换代码  监听src下文件夹变化  重新生成bundle中的代码并传给客户端  使用eval执行代码
         function hotModuleReplace() {
             var ws = new WebSocket("ws://localhost:3001/");
             //监听建立连接
             ws.onopen = function (res) {
                 console.warn('websocket连接成功,热更新准备就绪');
             }
     
             //监听服务端发来modules 
             ws.onmessage = function (res) {
                 const newModule = eval('(' + res.data + ')')
                 for (let key in newModule) { //替换本地的modules 重新执行require(entry) (重新执行bundle整体文件)
                     modules[key] = newModule[key]
                     require(${JSON.stringify(this.config.entry)})
                 }
             }
         };
     
         hotModuleReplace()
     `

        //插入热更新代码到result中
        const length = result.length - 5
        result = result.slice(0, length) + hotReplaceCode + result.slice(length)

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

    //todo 创建新模块字符串(用于热更新)
    createNewModuleStr(entry) {
        const newManifest = this.createManifest(entry)
        return this.createModules(newManifest)
    }

    //todo 构建模块 生成bundle代码
    buildModules() {
        const manifest = this.createManifest(this.config.entry)  // 创建文件依赖图(Manifest)
        const modules = this.createModules(manifest) // 生成modules
        let result = this.createOutputCode(modules)// 打包模块生成bundle代码

        //todo hot为true时进行热更新
        if (this.config.hot) {
            result = this.hotUpdate(result)
        }
        //todo 生产模式进行代码压缩  默认不压缩
        if (this.config.mode === 'production') {
            result = compress(result)
        }

        return result
    }

    //todo 综合bundle方法
    bundle() {

        getProgressCount(this.config.entry) // 计算进度条

        this.callBeforeCompileSyncHooks() //!执行生命中周期钩子
        const result = this.buildModules(this.config.entry)
        this.callAfterCompileSyncHooks() //!执行生命中周期钩子

        this.callBeforeDistSyncHooks() //!执行生命中周期钩子
        this.outputDist(result)   // 生成dist文件夹
        this.callAfterDistSyncHooks() //!执行生命中周期钩子

    }
}

module.exports = Webpack 