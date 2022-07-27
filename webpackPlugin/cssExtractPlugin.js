const path = require('path')
const fs = require('fs')



class CssExtractPlugin {
    constructor({ fileName }) {
        this.fileName = fileName || 'index.css'
    }

    extractCSS(compiler) {

        let cssCode = ``

        compiler.Manifast.forEach(module => {
            module.dependencies.forEach((depPath) => {

                const suffix = depPath.split('.').pop()

                if (suffix === 'css') {
                    const absolutePath = module.mapping[depPath]
                    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
                    cssCode += fileContent + '\n\n'
                }
            })
        });

        const filePath = path.join(compiler.config.output, this.fileName)
        fs.writeFileSync(filePath, cssCode)
    }

    run(compiler) {
        //todo 将createHtml注册到webpack的afterDistSync钩子队列  打包时执行 
        const extractCSS = this.extractCSS.bind(this, compiler)
        compiler.hooks.afterDistSync.tap(extractCSS)
    }
}


module.exports = CssExtractPlugin