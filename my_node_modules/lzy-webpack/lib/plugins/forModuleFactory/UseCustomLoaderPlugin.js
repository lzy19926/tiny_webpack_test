// 用于批量执行用户自定义loader的插件
const fs = require('fs')


class UseCustomLoaderPlugin {
    constructor() { }

    useCustomLoader(moduleFactory, resolveData, callNext) {
        
        const absolutePath = resolveData.request
        const fileContent = fs.readFileSync(absolutePath, 'utf-8')
        const rules = moduleFactory.config.rules

        if (!rules) return fileContent

        // 遍历rules 如果尾缀符合  则调用其中的loader 处理字符串
        let res = fileContent
        rules.forEach((rule) => {
            if (rule.test.test(absolutePath)) {
                rule.use.forEach((loader) => {
                    res = loader(res)
                })
            }
        })

        Object.assign(resolveData.processResult, { fileContent: res })

        // 继续下个插件
        callNext()
    }

    //todo 将useCustomLoader方法注册到moduleFactory的create钩子队列  创建module时执行 
    run(moduleFactory) {
        const handler = this.useCustomLoader.bind(this, moduleFactory)
        moduleFactory.hooks.create.tapAsync("UseCustomLoaderPlugin", handler)
    }
}

module.exports = UseCustomLoaderPlugin