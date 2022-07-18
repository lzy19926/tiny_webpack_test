# tiny_webpack_test

 1. 安装依赖  npm i lzy-webpack lzy-webpack-dev-server
 2. 配置package.json文件   
 3. npm run build  //打包 
 4. npm run dev  //运行dev-server


 ## webpack.config.js说明
需要在根目录创建webpack.config.js文件
 暂时不支持plgin和loader  以下五个配置都为必选项    其他配置暂无
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

### 源码说明
文件夹中的 lzy-webpack lzy-webpack-dev-server为源码  可以随便看看   望指正
可以通过npm run t-build/t-dev命令执行


### 更新lzy-esBuild  
使用JS手写的esBuild学习项目,   可以使用npm run t-esbuild执行(需要配置webpack.config.js)
