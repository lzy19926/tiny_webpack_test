const fs = require('fs')
const parser = require('@babel/parser');
const nodePath = require('path');
const webpackConfig = require('../../../webpack.config')
// 因为使用了ESM export导出  使用require引入时需要.default
const generate = require('@babel/generator').default; // AST转js代码
const traverse = require('@babel/traverse').default // 遍历AST
const t = require('@babel/types') // 用于创建AST节点
const { changeColor } = require('./utils')
// 维护的全局变量映射
let varibleMap = new Map()

//构建文件依赖列表(深度优先遍历树 形成queue  不构建依赖图)
function createAssetsList(entry) {
    let id = 0;
    const depQueue = []
    const importCodeEXP = /(import).*['"]/g // 以import开头 '或"结尾的字符
    const depPathEXP = /['"].*?['"]/g

    function readFileDeps(absolutePath) {

        const dirname = nodePath.dirname(absolutePath)
        const fileContent = fs.readFileSync(absolutePath, 'utf-8')
        depQueue.push({
            filePath: absolutePath,
            code: fileContent,
            id: id++
        })

        //获取import语句 截取依赖文件路径  推入数组
        const res = `${fileContent}`.match(importCodeEXP) || []

        res.forEach((code) => {
            const path = code.match(depPathEXP)[0]
            const pathStr = path.slice(1, path.length - 1)
            const depAbsolutePath = nodePath.join(dirname, pathStr)
            readFileDeps(depAbsolutePath)
        })
    }

    readFileDeps(entry)
    return depQueue
}



function handleAssets(asset) {

    const ast = parser.parse(asset.code, {
        sourceType: 'module'
    })
    const id = asset.id

    traverse(ast, {
        //todo 使用正则表达式读取import  构建文件列表(这里删除import语句)
        ImportDeclaration: (path, state) => {
            const importVars = path.node.specifiers

            importVars.forEach((varibleAst) => {
                const importVarType = varibleAst.type
                switch (importVarType) {
                    case 'ImportNamespaceSpecifier': // 导入的命名空间  (import * as API) 
                        break;
                    case 'ImportDefaultSpecifier': // 默认导入的变量(创建对应的变量声明 指向导出的变量)
                        break;
                    case 'ImportSpecifier': // 普通导入的变量
                        break;
                }
            })

            path.remove()
        },

        //todo 处理Export变量声明 / Export函数声明
        ExportNamedDeclaration: (path, state) => {
            const dec = path.node.declaration
            ast.program.body.unshift(dec) //添加变量  函数声明到文件Ast中
            switch (dec.type) {
                case 'FunctionDeclaration':
                    handleVaribleConflect(dec)
                    break;
                case 'VariableDeclaration':
                    dec.declarations.forEach((varibleAst) => {
                        handleVaribleConflect(varibleAst)
                    })
                    break;
            }

            path.remove()
        },

        //todo 处理export default语句
        ExportDefaultDeclaration: (path, state) => {
            //修改函数声明declaration为函数表达式Expression
            const dec = path.node.declaration
            if (dec.type === 'FunctionDeclaration') { dec.type = 'FunctionExpression' }
            //将export default转换为var _defaultExport = XXX
            const varName = t.identifier(`_defaultExport_${id}`)
            const varDec = t.variableDeclarator(varName, dec)
            const defaultVar = t.variableDeclaration('var', [varDec])

            ast.program.body.unshift(defaultVar) //添加到文件Ast中
            path.remove()//删除原句
        },

        //todo 处理变量声明(Declaration指 const a=1;Declarator指 a=1 没有前面的声明关键字)
        VariableDeclaration: (path, state) => {
            const variableDeclaration = path.node
            variableDeclaration.declarations.forEach((varibleAst) => {
                handleVaribleConflect(varibleAst)
            })
        },

        //todo 处理执行语句中的变量
        ExpressionStatement: (path, state) => {
            const args = path.node.expression.arguments
            if (!Array.isArray(args)) return
            args.forEach((argAst) => {
                handleExpVaribleConfilect(argAst)
            })
        },
        //todo 处理函数声明冲突/处理函数变量    
        FunctionDeclaration: (path, state) => {
            handleVaribleConflect(path.node)
        },

    })

    const es6Code = generate(ast)

    es6Code.code =
        `
         //${asset.filePath} ---id:${id}
         ${es6Code.code}
        `

    return es6Code.code
}
//-------------打包处理资产--------------------
function budleAsstes(assetsList) {
    let codeStr = ``

    for (let i = assetsList.length - 1; i >= 0; i--) {
        const es6Code = handleAssets(assetsList[i])
        codeStr += es6Code
    }

    return codeStr
}

// 每次声明变量时执行下列方法  解决变量名冲突 
function handleVaribleConflect(varibleAst) {
    const varibleName = varibleAst.id.name
    let num = varibleMap.get(varibleName)
    if (!num) {
        varibleMap.set(varibleName, 1)
    } else {
        varibleMap.set(varibleName, num += 1)
        const newVaribleName = varibleName + '_' + num.toString()
        varibleAst.id.name = newVaribleName
        handleVaribleConflect(varibleAst)
    }
}

function handleExpVaribleConfilect(argAst) {
    const name = argAst.name
    const num = varibleMap.get(name)
    if (num && num !== 1) {
        argAst.name = name + '_' + num.toString()
        handleExpVaribleConfilect(argAst)
    }
}


// 生成out文件
function createOut(code) {

    const res = `
(function(){
    ${code}
})()
`

    const htmlTpl = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="./out.js"></script>
    </body>
    </html>`

    //todo 没有dist时创建dist文件夹
    const hasDir = fs.existsSync(webpackConfig.output)
    if (!hasDir) {
        fs.mkdirSync(webpackConfig.output)
    }

    //todo 写入文件
    fs.writeFileSync(webpackConfig.output + '/out.js', res)
    fs.writeFileSync(webpackConfig.output + '/index.html', htmlTpl)

}


function bundle() {


    console.time(changeColor('构建依赖列表用时', 92))
    const assetsList = createAssetsList(webpackConfig.entry)
    console.timeEnd(changeColor('构建依赖列表用时', 92))

    console.time(changeColor('打包整体用时', 93))
    const resCode2 = budleAsstes(assetsList)
    createOut(resCode2)
    console.timeEnd(changeColor('打包整体用时', 93))



}



module.exports = { bundle }