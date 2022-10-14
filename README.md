# tiny_webpack_test
 1. 安装依赖 npm install
 1. npm run t-build  //打包 
 2. npm run t-dev  //运行dev-server

## myReact项目说明
 1. 内置三个测试页面   
 2. 文件后缀使用.lzy
 3. 其他功能详见Demo页面



### 源码说明
文件夹中的 my_node_modules为手写的各种库源码  可以随便看看   望指正


### 更新lzy-esBuild  
使用JS手写的esBuild学习项目,   可以使用npm run t-esbuild执行(需要配置webpack.config.js)


 ## webpack.config.js说明
需要在根目录创建webpack.config.js文件
支持plgin和loader  以下五个配置都为必选项 
```
const path = require('path')

module.exports = {
    mode: 'develpoment', // 支持 none|development|production  生成模式会进行代码压缩
    entry: path.join(__dirname, '/src/index.js'), //配置打包入口
    output: path.join(__dirname, '/dist'), // 出口
    rootPath: __dirname, // 项目根路径
    hot: true,// 启动devserver热更新
}

```


