// 模块完成构建时结果处理的插件

class ModuleResultPlugin {
    constructor() { }

    // 完成构建模块
    handleModuleResult(normalModule) {
        normalModule.isDone = true
    }

    //todo 将handleModuleResult方法注册到moduleFactory的create钩子队列  创建module成功时执行 
    run(generator) {
        const handler = this.handleModuleResult.bind(this)
        generator.hooks.generate.tapAsync("ModuleResultPlugin", handler)
    }
}

module.exports = ModuleResultPlugin