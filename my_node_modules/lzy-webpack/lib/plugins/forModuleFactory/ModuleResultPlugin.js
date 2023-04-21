// 模块完成构建时结果处理的插件

class ModuleResultPlugin {
    constructor() { }

    // 完成构建模块
    handleModuleResult(resolveData) {
        resolveData.isDone = true
    }

    //todo 将handleModuleResult方法注册到moduleFactory的create钩子队列  创建module成功时执行 
    run(moduleFactory) {
        const handler = this.handleModuleResult.bind(this)
        moduleFactory.hooks.create.tapAsync("ModuleResultPlugin", handler)
    }
}

module.exports = ModuleResultPlugin