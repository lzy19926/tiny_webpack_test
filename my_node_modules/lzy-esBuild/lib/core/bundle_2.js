const fs = require('fs')
const parser = require('@babel/parser');
const nodePath = require('path');
const webpackConfig = require('../../../webpack.config')
// 因为使用了ESM export导出  使用require引入时需要.default
const generate = require('@babel/generator').default; // AST转js代码
const traverse = require('@babel/traverse').default // 遍历AST
const t = require('@babel/types') // 用于创建AST节点


// 维护的全局变量映射
let varibleMap = new Map()
let id = 0
//------------原方案--------------------
function createAssets(absolutePath) {
    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    const ast = parser.parse(fileContent, {
        sourceType: 'module'
    })


    const dependencies = []

    traverse(ast, {
        ImportDeclaration: (path, state) => {
            const depRaletivePath = path.node.source.value
            dependencies.push(depRaletivePath) //todo 每次遇到import语句  将其文件路径push到依赖数组
            // path.remove() //todo  通过AST删除import语句(直接使用path.remove方法删除语句)
        },
    })

    return {
        filePath: absolutePath,
        ast: ast,
        dependencies,
        id: id++
    }
}

function createAssetsList(entry) {
    const mainAsset = createAssets(entry)
    const queue = [mainAsset]

    for (const asset of queue) {
        const dirname = nodePath.dirname(asset.filePath)
        asset.dependencies.forEach(relativePath => {
            const absolutePath = nodePath.join(dirname, relativePath)
            const childAsset = createAssets(absolutePath)
            queue.push(childAsset)
        })
    }

    return queue
}

//-------------打包处理资产--------------------
function budleAsstes(assetsList) {
    let codeStr = ``

    for (let i = assetsList.length - 1; i >= 0; i--) {
        const ast = assetsList[i].ast
        const id = assetsList[i].id

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
                args.forEach((argAst) => {
                    handleExpVaribleConfilect(argAst)
                })
            },
            //todo 处理函数声明冲突/处理函数变量    
            FunctionDeclaration: (path, state) => {
                handleVaribleConflect(path.node)
            },

        })

        const es6Code = generate(assetsList[i].ast)

        es6Code.code =
            `
        //${assetsList[i].filePath} ---id:${id}
        ${es6Code.code}
        `
        codeStr += es6Code.code
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



function bundle2() {
    console.time('CREATE LIST')
    const assetsList = createAssetsList(webpackConfig.entry)
    const resCode = budleAsstes(assetsList)
    createOut(resCode)
    console.timeEnd('CREATE LIST')
}



module.exports = { bundle2 }
