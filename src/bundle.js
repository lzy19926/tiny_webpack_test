// 构建文件资源数据
function createAssets(absolutePath) {

    const fileContent = fs.readFileSync(absolutePath, 'utf-8')
    //! 使用babel/parser将index代码转换为AST语法树  (不支持模块化语法 需要进行配置)
    const ast = parser.parse(fileContent, {
        sourceType: 'module'
    })

    //! 使用babel/traverse遍历AST语法树  将所有import的文件推入dependencise数组
    const dependencies = []

    traverse(ast, {
        ImportDeclaration: (path, state) => {
            dependencies.push(path.node.source.value) //todo 每次遇到import语句  将其文件路径push到依赖数组
        }
    })


    //!使用babel/core 转化ast为ES5语法 支持浏览器运行
    const es5Code = babel.transformFromAstSync(ast, null, {
        presets: ['@babel/preset-env'],
        plugins: []
    })

    fileID += 1
    // 返回处理好的文件路径   es5代码  依赖文件
    return {
        fileID,
        filePath: absolutePath,
        code: es5Code.code,
        dependencies
    }

}

//构建文件依赖图   (注意  import 文件的时候需要加上后缀.js)
function createGraph(entry) {

    //1 通过入口文件构建文件资源
    const mainAsset = createAssets(entry)

    //2 使用队列循环方式构建依赖图(遍历+递归 使用createAssets处理每个js文件)
    const queue = [mainAsset]

    for (const asset of queue) {

        const dirname = path.dirname(asset.filePath) // 获取当前处理文件的绝对路径
        asset.mapping = {} // 文件的依赖map

        asset.dependencies.forEach(relativePath => {// 遍历文件依赖的文件(import)
            const absolutePath = path.join(dirname, relativePath) // 获取import文件的绝对路径
            const childAsset = createAssets(absolutePath) //! 通过绝对路径构建子文件资源

            asset.mapping[relativePath] = childAsset.fileID //!通过相对路径和id匹配 构建资源依赖图
            queue.push(childAsset) // 处理好的资源推入数组 (childAsset会进入下个循环继续执行)
        })
    }

    fileID = -1  //生成依赖图后重置id
    return queue
}

// 通过依赖图生成模块对象
function bundleGraph(graph) {
    let modulesStr = '';

    graph.forEach(module => {

        const key = module.fileID
        const code = `function(require,module,exports){
            ${module.code}
        } `
        const mapping = JSON.stringify(module.mapping)

        // 单个模块资源
        const modulesPart = `${key}:[\n ${code},\n ${mapping} \n ],\n`
        modulesStr += modulesPart
    })

    return `{${modulesStr}}`
}

// 实现CMD 打包文件依赖图
function bundleModules(modulesStr) {

    const result = `
    // -------------------泽亚的webpack---------------------------
        (function(){
            //todo 传入modules
            var modules = ${modulesStr}

            function require(id){

                //! 通过id获取module 解构出代码执行函数fn和mapping
                const [fn,mapping]  = modules[id]

                //! 构造fn所需的三个参数 构建自己的module对象
                const loaclRequire =(relativePath)=>{
                    return  require(mapping[relativePath])
                }

                //! 构造模拟Node的module对象
                const module = {
                    exports:{}
                }

                //! 将三个参数传入fn并执行
                fn(loaclRequire,module,module.exports)

                //! 将本模块导出的代码返回
                return module.exports
            }

            //! 执行require(entry)入口模块
             require(0)

        })();
    `
    return result
}