

class UmdLibraryPlugin {
    constructor() { }


    // 生成UMD格式化规范的output代码
    createCode_UMD(modulesStr) {

        if (!this.config.umdName) {
            console.error("使用了UMD规范,请配置'umdName'属性以挂载到window上")
        }

        return `
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

    run() { }
}

module.exports = UmdLibraryPlugin