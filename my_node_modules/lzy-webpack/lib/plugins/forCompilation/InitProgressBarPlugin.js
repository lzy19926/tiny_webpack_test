//初始化进度条  计算总进度步数
const Bar = require('../../progressBar/Bar')

class InitProgressBarPlugin {
    constructor() { }
    
    initProgressBar(compilation) {
        const progressBar = new Bar()
        compilation.progressBar = progressBar
    }

    run(compilation) {
        const handler = this.initProgressBar.bind(this, compilation)
        compilation.hooks.beforeCompileSync.tap("InitProgressBarPlugin", handler)
    }
}

module.exports = InitProgressBarPlugin