// 用于给路径添加.js后缀的插件 

class AddFileSuffixPlugin {
    constructor() { }

    // 添加.js后缀（需要插件化） 
    addFileSuffix(resolveData) {
        let path = resolveData.request
        const needHandle = !(path[0] !== '.' && path[1] !== ':')

        if (needHandle) {
            var index = path.lastIndexOf(".");
            var ext = path.substr(index + 1);

            if (ext.length > 5) {
                path = path + '.js'
            }
        }
        
        resolveData.request = path
        return path
    }

    //todo 将addFileSuffix方法注册到moduleFactory的create钩子队列  创建module时执行 
    run(moduleFactory) {
        const handler = this.addFileSuffix.bind(this)
        moduleFactory.hooks.create.tap("AddFileSuffixPlugin", handler)
    }
}

module.exports = AddFileSuffixPlugin