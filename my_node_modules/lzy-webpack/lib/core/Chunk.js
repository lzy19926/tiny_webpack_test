const SparkMD5 = require('spark-md5')

/**
 * Chunk是一个模块整合, 可被单独输出成文件
 * 比如bundle.js  bundle.css
 * */
class Chunk {
    constructor(params) {
        this.type = params.type
        this.name = params.name
        this.modules = new Map()
        this.code = undefined

        this._sourceSize = 0
        this._hash = undefined


    }

    addModule(module) {
        this.modules.set(module.filePath, module)
        module.setChunk(this)
    }
    getHash() {
        return this._hash
    }
    getSize() {
        return this._sourceSize
    }
    _updateSize() {
        this._sourceSize = Buffer.from(this.code, 'utf8').length;
        return this._sourceSize
    }
    _updateHash() {
        this._hash = SparkMD5.hash(this.code);
        return this._hash
    }
    update() {
        this._updateSize()
        this._updateHash()
    }
}

module.exports = Chunk