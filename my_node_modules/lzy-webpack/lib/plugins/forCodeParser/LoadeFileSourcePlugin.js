const fs = require('fs')

// 用于读取文件内容  预处理的插件
class LoadeFileSourcePlugin {
    constructor() { }

    // 执行自定义loader
    runCustomLoaders(normalModule, sourceCode) {

        const rules = normalModule.loaders
        const path = normalModule.filePath

        if (!rules) return sourceCode

        let resultCode = sourceCode
        // 遍历rules 如果尾缀符合  则调用其中的loader 处理字符串
        rules.forEach((rule) => {
            if (rule.test.test(path)) {
                rule.use.forEach((loader) => {
                    resultCode = loader(sourceCode)
                })
            }
        })

        return resultCode
    }

    loadeFileSource(normalModule, callNext) {

        const originCode = fs.readFileSync(normalModule.filePath, 'utf-8')

        const loadedCode = this.runCustomLoaders(normalModule, originCode)

        normalModule.originCode = originCode
        normalModule.sourceCode = loadedCode

        // 继续下个插件
        callNext()
    }

    //todo 将useCustomLoader方法注册到moduleFactory的create钩子队列  创建module时执行 
    run(parser) {
        const handler = this.loadeFileSource.bind(this)
        parser.hooks.parseAST.tapAsync("LoadeFileSourcePlugin", handler)
    }
}

module.exports = LoadeFileSourcePlugin