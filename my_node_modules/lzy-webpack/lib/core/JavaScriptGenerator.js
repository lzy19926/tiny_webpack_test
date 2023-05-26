const { AsyncSeriesHook } = require('../../packages/lzy_tapable/lib/index')
const ModuleResultPlugin = require('../plugins/forCodeGenerator/ModuleResultPlugin')
const ES5codeGeneratePlugin = require('../plugins/forCodeGenerator/ES5codeGeneratePlugin')


// JavascriptGenerator它用于生成静态JavaScript代码
class JavascriptGenerator {
    /** @param {"javascript"} type 暂时只支持javascript类型*/
    constructor(
        type = "javascript",
        options
    ) {
        this.sourceType = type
        this.hooks = {
            generate: new AsyncSeriesHook(["normalModule"]),
        }

        this.registSystemPlugins()
    }

    //todo  注册系统内置插件
    registSystemPlugins() {
        // generateCode
        new ES5codeGeneratePlugin().run(this)
        new ModuleResultPlugin().run(this)
    }

    // 执行生命周期钩子,处理模块
    generate(normalModule) {
        this.hooks.generate.call(normalModule)

        // 读取流转结果,生成模块
        if (normalModule.isDone) {
            return normalModule
        }
    }
}


module.exports = JavascriptGenerator