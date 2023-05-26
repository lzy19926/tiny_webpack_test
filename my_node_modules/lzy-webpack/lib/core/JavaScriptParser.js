const { AsyncSeriesHook } = require('../../packages/lzy_tapable/lib/index')
const LoadeFileSourcePlugin = require('../plugins/forCodeParser/LoadeFileSourcePlugin')
const ResolveDependenciesPlugin = require('../plugins/forCodeParser/ResolveDependenciesPlugin')
const TraverseASTPlugin = require('../plugins/forCodeParser/TraverseASTPlugin')


// 用于解析代码  做AST处理

class JavaScriptParser {

    /** @param {"module" | "script" | "auto"} type parse可支持的代码种类*/
    constructor(
        type = "auto",
        options
    ) {
        this.sourceType = type  // 代码类型 CJS 或者是ESM 
        this.hooks = {
            parseAST: new AsyncSeriesHook(["normalModule"])
        }

        this.registSystemPlugins()
    }

    // 注册插件
    registSystemPlugins() {
        // parseAST
        new LoadeFileSourcePlugin().run(this)
        new ResolveDependenciesPlugin().run(this)
        new TraverseASTPlugin().run(this)
    }

    // 执行生命周期钩子,处理模块
    parse(normalModule) {
        // 执行插件流转逻辑 
        this.hooks.parseAST.call(normalModule)
        return normalModule
    }
}

module.exports = JavaScriptParser
