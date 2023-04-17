//初始化用户插件 将用户插件注册到Hook中
class InitCustomPluginsPlugin {
    constructor() { }

    //todo 调用所有plugins上的run方法  挂载plugins上的处理函数到钩子上
    initPlugins(compilation) {
        const plugins = compilation.config.plugins
        if (Array.isArray(plugins)) {
            plugins.forEach((plugin) => {
                plugin.run(compilation) //传入当前compilation实例
            })
        }
    }

    //todo 将initPlugins方法注册到webpack的initSync钩子队列 初始化时执行
    run(compilation) {
        const handler = this.initPlugins.bind(this, compilation)
        compilation.hooks.beforeCompileSync.tap("InitCustomPluginsPlugin", handler)
    }
}

module.exports = InitCustomPluginsPlugin