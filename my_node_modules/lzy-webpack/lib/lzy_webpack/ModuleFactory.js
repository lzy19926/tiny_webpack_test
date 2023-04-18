

// 模块工厂,用来给Compilation创建单个模块资源
// 在创建Compilation时通过param注入
const fs = require('fs')

const babel = require('@babel/core')
const parser = require('@babel/parser')
const types = require('@babel/types') // 用于创建AST节点
const traverse = require('@babel/traverse').default
const { importStatic } = require('./importStatic')


class ModuleFactory {
    constructor(resolverFactory, config) {
        this.config = config
        this.resolverFactory = resolverFactory
    }

    // 使用自定义loader （需要插件化） 
    useCustomLoader(absolutePath) {
        const fileContent = fs.readFileSync(absolutePath, 'utf-8')
        const rules = this.config.rules

        if (!rules) return fileContent

        // 遍历rules 如果尾缀符合  则调用其中的loader 处理字符串
        let res = fileContent
        rules.forEach((rule) => {
            if (rule.test.test(absolutePath)) {
                rule.use.forEach((loader) => {
                    res = loader(res)
                })
            }
        })

        return res
    }

    // 添加.js后缀（需要插件化） 
    addFileSuffix(path) {
        if (path[0] !== '.' && path[1] !== ':') return path

        var index = path.lastIndexOf(".");
        var ext = path.substr(index + 1);

        if (ext.length > 5) {
            path = path + '.js'
        }
        return path
    }

    //非js,cjs,mjs,jsx文件或者lzy不执行
    checkFileSuffix(absolutePath) {
        const isJSFile = /\.js$/.test(absolutePath)
            || /\.ts$/.test(absolutePath)
            || /\.cjs$/.test(absolutePath)
            || /\.mjs$/.test(absolutePath)
            || /\.jsx$/.test(absolutePath)
            || /\.tsx$/.test(absolutePath)
        const isLzyFile = /\.lzy$/.test(absolutePath)
        if (!isJSFile && !isLzyFile) {
            console.error('只能加载js,ts,cjs,mjs,jsx,tsx类型文件')
            return false
        }

        return true
    }

    // 生成es5 代码和依赖数组(需要插件化)
    traverseAST(params) {
        const { fileContent, dependencies } = params

        //! 使用babel/parser将index代码转换为AST语法树  (不支持模块化语法 需要进行配置)
        const ast = parser.parse(fileContent, {
            sourceType: 'module'
        })

        //! 使用babel/traverse遍历AST语法树  将所有import的文件推入dependencise数组
        // 传入的配置对象为visitor,配置钩子函数 不同的钩子会返回不同的语句(import expresstion等)
        // 遍历到对应的语句  就会执行钩子函数  返回语句的信息 (详见AST Exporer)   
        traverse(ast, {
            ImportDeclaration: (path, state) => {//todo 遇到import语句  将文件路径push到依赖数组(预处理path)
                const depRaletivePath = path.node.source.value

                dependencies.push(depRaletivePath)
                if (/\.css$/.test(depRaletivePath)) {
                    path.remove()
                }
            },
            CallExpression: (path, state) => {//todo 遇到require语句  将文件路径push到依赖数组(预处理path)
                const idName = path.node.callee?.name
                if (idName === 'require') {
                    let depRaletivePath = path.node.arguments[0].value

                    dependencies.push(depRaletivePath)
                    if (/\.css$ /.test(depRaletivePath)) {
                        path.remove()
                    }
                }
            },
            VariableDeclarator: (path, state) => {//todo 遇到importStatic语句  (处理path,替换AST)
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
                    ast.program.body.unshift(defaultVar) //添加到文件Ast中
                    path.remove()//删除原句
                }
            },
        })

        //!使用babel/core 转化ast为ES5语法 支持浏览器运行
        // 三号参数配置babel转化的插件(与webpack类似)(preset是使用的插件集合)
        const es5Code = babel.transformFromAstSync(ast, null, {
            presets: ['@babel/preset-env']
        })

        return es5Code?.code || ""
    }

    create({ absolutePath }) {
        //! 先调用用户的loader
        absolutePath = this.addFileSuffix(absolutePath)
        const fileContent = this.useCustomLoader(absolutePath)

        //! 非js,cjs,mjs,jsx文件或者lzy不执行
        const validateSuffix = this.checkFileSuffix(absolutePath)
        if (!validateSuffix) return 

        //! --------生成ES5代码  生成dependencies数组
        const dependencies = []
        const es5Code = this.traverseAST({ fileContent, dependencies })

        const module = {
            filePath: absolutePath,
            code: es5Code,
            dependencies
        }

        return module
    }
}


module.exports = ModuleFactory