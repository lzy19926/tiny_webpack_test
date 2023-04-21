//!! 用于检查文件后缀名的插件(应该是enhanced-resolve做的事情 需要修改)

class CheckFileSuffixPlugin {
    constructor() { }
    //非js,cjs,mjs,jsx文件或者lzy不执行
    checkFileSuffix(resolveData, callNext) {
        
        const absolutePath = resolveData.request

        const isJSFile = /\.js$/.test(absolutePath)
            || /\.ts$/.test(absolutePath)
            || /\.cjs$/.test(absolutePath)
            || /\.mjs$/.test(absolutePath)
            || /\.jsx$/.test(absolutePath)
            || /\.tsx$/.test(absolutePath)
        const isLzyFile = /\.lzy$/.test(absolutePath)

        if (!isJSFile && !isLzyFile) {
            console.error('只能加载js,ts,cjs,mjs,jsx,tsx类型文件')

            return false
        }

        // 继续下个插件
        callNext()
    }

    //todo 将checkFileSuffix方法注册到moduleFactory的create钩子队列  创建module时执行 
    run(moduleFactory) {
        const handler = this.checkFileSuffix.bind(this)
        moduleFactory.hooks.create.tapAsync("CheckFileSuffixPlugin", handler)
    }
}

module.exports = CheckFileSuffixPlugin