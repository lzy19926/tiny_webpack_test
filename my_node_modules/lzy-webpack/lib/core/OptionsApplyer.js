const { AsyncSeriesHook } = require('../../packages/lzy_tapable/lib/index')
const CodeCompressPlugin = require('../plugins/forOptionsApply/CodeCompressPlugin')

// 用于统一处理option
class WebpackOptionsApply {
    constructor() {
        this.hooks = {
            ApplySync: new AsyncSeriesHook(["compilation"]),
        }

        this.registSystemPlugins()
    }

    registSystemPlugins() {
        // apply
        new CodeCompressPlugin().run(this)
    }

    apply(compilation) {
        this.hooks.ApplySync.call(compilation)
    }
}

module.exports = WebpackOptionsApply;