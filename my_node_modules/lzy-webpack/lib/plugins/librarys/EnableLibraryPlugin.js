const { kindOf } = require('../../utils/kindOf')

const WindowLibraryPlugin = require("./WindowLibraryPlugin");
const AmdLibraryPlugin = require("./AmdLibraryPlugin");
const CommonjsLibraryPlugin = require("./CommonjsLibraryPlugin");
const UmdLibraryPlugin = require("./UmdLibraryPlugin");
const ModuleLibraryPlugin = require("./ModuleLibraryPlugin");


class EnableLibraryPlugin {
    constructor() {
        this.type = type // 从config中进行注入
    }

    // 给生成的module代码包装为各种不同的模块
    buildAsLibrary() {
        // 准备好outputCode的数据类型
        const modulesStr = "const modules = []"
        const type = this.type
        if (typeof type === 'string') {
            switch (type) {
                case "window": { }
                case "commonjs": { }
                case "amd": { }
                case "umd": { }
                case "module": { }
                default:
                    throw new Error(`Unsupported library type ${type}.`)
            }
        } else {
            throw new Error(`config "type" must be a string , Get ${kindOf(this.type)}.`)
        }
    }

    // 注册
    run(compiler) {

    }
}


module.exports = EnableLibraryPlugin