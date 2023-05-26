const types = require('@babel/types') // 用于创建AST节点
const traverse = require('@babel/traverse').default
const { importStatic } = require('../../api/importStatic')


// 对当前运行时AST进行批处理的插件 
// 在javascriptGenerator处由AST生成对应的js代码
class TraverseASTPlugin {
    constructor() { }

    traverseAST(normalModule, callNext) {

        const sourceAST = normalModule._ast

        //! 使用babel/traverse遍历AST语法树 进行对应的处理
        traverse(sourceAST, {
            VariableDeclarator: this.replace_ImportStatic,
            // ImportDeclaration: undefined,
            // CallExpression: undefined
        })

        normalModule._ast = sourceAST

        // 继续下个插件----END
        // callNext()
    }

    //todo 遇到importStatic语句  (处理path,替换AST)
    replace_ImportStatic(path, state) {
        const isImportStatic =
            path.node.init?.type === 'CallExpression' &&
            path.node.init?.callee?.name === 'importStatic'

        if (isImportStatic) {
            const key = path.node.id.name
            const value = path.node.init.arguments[0].value
            const nextValue = importStatic(value) // 删除多余public
            const varName = types.identifier(key) // 变量名
            const init = types.stringLiteral(nextValue);// 变量值 类型为string
            const varDec = types.variableDeclarator(varName, init) // 创建变量key = value
            const defaultVar = types.variableDeclaration('var', [varDec]) // 写入变量声明 var 
            sourceAST.program.body.unshift(defaultVar) //添加到文件Ast中
            path.remove()//删除原句
        }
    }


    //todo 将useCustomLoader方法注册到moduleFactory的create钩子队列  创建module时执行 
    run(parser) {
        const handler = this.traverseAST.bind(this)
        parser.hooks.parseAST.tapAsync("TraverseASTPlugin", handler)
    }
}

module.exports = TraverseASTPlugin



