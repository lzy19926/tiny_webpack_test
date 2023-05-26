

class CommonjsLibraryPlugin {
    constructor(compilation) {
        this.compilation = compilation
    }

    render(chunk) {
        // 构建的结果是一个立即执行函数   将modules传进去
        // module中包含了 fn函数(将模块代码包裹并执行的函数) 和模块依赖的mapping 
        // require函数传入(require,module,export) 三个参数
        //todo 也就是模拟了node的require方法和生成模拟module对象

        const config = this.compilation.config
        const modulesStr = chunk.code

        const wrappedStr = `
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
                 var entryModule = require(${JSON.stringify(config.entry)})

                 //! 模拟UMD模块化规范,将入口模块导出？？
                   try{
                    module.exports = entryModule
                    }catch(err){
                        
                    }
               
            })();`

        chunk.code = wrappedStr
    }

    run() {
        // doNothing
    }
}

module.exports = CommonjsLibraryPlugin