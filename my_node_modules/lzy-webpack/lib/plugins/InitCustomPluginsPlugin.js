//初始化用户插件 将用户插件注册到Hook中
class InitCustomPluginsPlugin {
    constructor() { }

    //todo 调用所有plugins上的run方法  挂载plugins上的处理函数到钩子上
    initPlugins(compiler) {
        const plugins = compiler.config.plugins

        if (Array.isArray(plugins)) {
            plugins.forEach((plugin) => {
                plugin.run(compiler) //传入当前compiler实例
            })
        }
    }

    //todo 将initPlugins方法注册到webpack的initSync钩子队列 初始化时执行
    run(compiler) {
        const handler = this.initPlugins.bind(this, compiler)
        compiler.hooks.initSync.tap("InitCustomPluginsPlugin", handler)
    }
}

module.exports = InitCustomPluginsPlugin