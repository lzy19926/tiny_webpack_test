const { kindOf } = require('../../utils/kindOf')

const WindowLibraryPlugin = require("./WindowLibraryPlugin");
const AmdLibraryPlugin = require("./AmdLibraryPlugin");
const CommonjsLibraryPlugin = require("./CommonjsLibraryPlugin");
const UmdLibraryPlugin = require("./UmdLibraryPlugin");
const ModuleLibraryPlugin = require("./ModuleLibraryPlugin");


class EnableLibraryPlugin {
    constructor(type) {
        this.compilation = null
        this.type = type || "commonjs"
    }

    // 给生成的module代码包装为各种不同的模块
    // (兼容各种模块化规范)
    buildAsLibrary(chunk, callNext) {
        //todo 准备好outputCode的数据类型
        const type = this.type
        // 根据不同的类型 动态执行插件
        if (typeof type === 'string') {
            switch (type) {
                case "window": {
                    new WindowLibraryPlugin(this.compilation).render(chunk)
                    break
                }
                case "commonjs": {
                    new CommonjsLibraryPlugin(this.compilation).render(chunk)
                    break
                }
                case "amd": {
                    new AmdLibraryPlugin(this.compilation).render(chunk)
                    break
                }
                case "umd": {
                    new UmdLibraryPlugin(this.compilation).render(chunk)
                    break
                }
                case "module": {
                    new ModuleLibraryPlugin(this.compilation).render(chunk)
                    break
                }
                default:
                    throw new Error(`Unsupported library type ${type}.`)
            }

            callNext()

        } else {
            throw new Error(`config "type" must be a string , Get ${kindOf(this.type)}.`)
        }
    }

    // 注册
    run(compilation) {
        this.compilation = compilation
        const handler = this.buildAsLibrary.bind(this)
        compilation.hooks.BundleSync.tapAsync("EnableLibraryPlugin", handler)
    }
}


module.exports = EnableLibraryPlugin