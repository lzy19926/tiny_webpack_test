const path = require('path')
const fs = require('fs')

const initHtmlTpl = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./bundle.js"></script>
</body>
</html>`


class HtmlPlugin {
    constructor({ template, fileName }) {
        this.fileName = fileName || 'index.html'
        this.htmlTemplate = template || initHtmlTpl
    }

    createHtml(webpackConfig) {
        //todo 没有dist时创建dist文件夹
        const hasDir = fs.existsSync(webpackConfig.output)
        if (!hasDir) {
            fs.mkdirSync(this.config.output)
        }

        //todo 将html模板内容写入html文件 
        const filePath = path.join(webpackConfig.output, this.fileName)
        fs.writeFileSync(filePath, this.htmlTemplate)
    }


    run(compiler) {
        //todo 将createHtml注册到webpack的afterDistSync钩子队列  打包时执行 
        const createHtmlFn = this.createHtml.bind(this, compiler.config)
        compiler.hooks.afterDistSync.tap(createHtmlFn)
    }
}


module.exports = HtmlPlugin