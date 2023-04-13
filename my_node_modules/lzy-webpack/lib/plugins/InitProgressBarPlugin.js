//初始化进度条  计算总进度步数
const Bar = require('../progressBar/Bar')

class InitProgressBarPlugin {
    constructor() { }

    initProgressBar(compiler) {
        const progressBar = new Bar()
        compiler.progressBar = progressBar
    }

    run(compiler) {
        const handler = this.initProgressBar.bind(this, compiler)
        compiler.hooks.initSync.tap("InitProgressBarPlugin", handler)
    }
}

module.exports = InitProgressBarPlugin