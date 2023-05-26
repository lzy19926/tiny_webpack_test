const babel = require('@babel/core')

// 用于将AST转化为ES5Code
class ES5codeGeneratePlugin {
    constructor() { }

    //!使用babel/core 转化ast为ES5语法 支持浏览器运行
    generateES5Code(normalModule, callNext) {

        const ast = normalModule._ast

        // 三号参数配置babel转化的插件(与webpack类似)(preset是使用的插件集合)
        const es5Code = babel.transformFromAstSync(ast, null, {
            presets: ['@babel/preset-env']
        })

        normalModule.sourceCode = es5Code?.code || ""

        // 继续下个插件
        callNext()
    }


    run(generator) {
        const handler = this.generateES5Code.bind(this)
        generator.hooks.generate.tapAsync("ES5codeGeneratePlugin", handler)
    }
}

module.exports = ES5codeGeneratePlugin



