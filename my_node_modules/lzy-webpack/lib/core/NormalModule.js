const SparkMD5 = require('spark-md5')

// 定义一个生成好的模块对象Module
// 这个Module会在MoudleFactory的各个hook插件中进行流转
class NormalModule {

    constructor(params) {
        const {
            type,
            filePath,
            dependencies,
            loaders,
            generator,
            parser,
            resolver,
        } = params

        this.type = type                  // 模块类型(js,css,..)
        this.filePath = filePath          // 模块路径
        this.dependencies = dependencies  // 依赖项
        this.depMapping = new Map()       // 依赖与其绝对路径的映射
        this.loaders = loaders            // loaders
        this.generator = generator        // 代码生成器
        this.parser = parser              // ast解析器
        this.resolver = resolver          // 路径解析器

        this.originCode = undefined       // 初始代码
        this.sourceCode = undefined       // 结果代码
        this._chunk = undefined            // 该模块所在的chunk
        this.isDone = false               // 流转标记,是否完成模块化构建
        this._sourceSize = 0              // 资源大小
        this._hash = undefined            // 模块hash值
        this._ast = null                  // 生成的ast(中间产物)
    }


    getHash() {
        return this._hash
    }
    getSize() {
        return this._sourceSize
    }
    setChunk(chunk) {
        this._chunk = chunk
    }
    getChunk() {
        return this._chunk
    }
    // 更新模块size
    updateSize() {
        this._sourceSize = Buffer.from(this.sourceCode, 'utf8').length; // 资源大小
        return this._sourceSize
    }
    // 更新模块hash(用于热更新)
    updateHash() {
        this._hash = SparkMD5.hash(this.sourceCode);; // hash
        return this._hash
    }
    update() {
        this.updateSize()
        this.updateHash()
    }
    // 执行构建
    build() {
        this.parser.parse(this)  // 调用parser解析
        this.update()
        this.generator.generate(this)  // 调用javaScriptGenetaror生成模块代码
    }
    // 更新模块
    rebuild() {
        this.build()
    }

}


module.exports = NormalModule


