


const path = require('path')
const Koa = require('koa');
const WebSocket = require('ws')
const { DirectoryWatcher } = require('lzy-watchpack')
const MemoryFileSystem = require("memory-fs");



class WebpackDevServer {
    constructor(webpack) {
        this.webpack = webpack
        this.config = webpack.config
        this.app = undefined     // koa服务器
        this.wsConnection = undefined  // webSocket链接实例
        this.memoFs = undefined   // 内存文件系统
        this.watcher = undefined  // 文件监视系统
    }

    //TODO 开启koa后端服务
    startServer() {
        const app = new Koa();
        const htmlStr = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
    (function(){
        var ws = new WebSocket("ws://localhost:3001/");

        ws.onconnection = function(){

        }

        ws.onmessage = function ({data}) {
                if(typeof data ==='object'){
                    const reader = new FileReader()
                    reader.readAsText(data)
                    reader.onload = ()=>{ 
                        eval(reader.result)
                    }
                }else if(typeof data ==='string'){
                        location.reload()
                }
        }
    })()
    </script>
</body>
</html>`
        app.use(async (ctx) => {
            ctx.body = htmlStr
        })

        app.listen(8080, () => {
            console.log('dev-server启动在8080端口');
        })

        this.app = app
    }

    //TODO 开启webSocket链接
    connectWebSocket() {
        //TODO 创建WebSocketServer到3001端口 (是一个独立的服务)
        //TODO 监听前后端链接事件  回调接收一个connection实例
        let that = this
        this.webSocket = new WebSocket.Server({ port: 3001 });
        this.webSocket.on('connection', function (wsConnection) {
            console.log('websocket连接成功,热更新准备就绪');
            that.wsConnection = wsConnection
            that.sendBundle()
        });
    }

    //TODO 开启文件监视系统
    watchFiles() {
        //创建文件监视器
        const srcPath = path.resolve(this.config.entry, '..')
        this.watcher = new DirectoryWatcher({
            directoryList: [srcPath],
            poll: 1000
        })

        const isDep = (path) => {//检查是否是依赖文件
            return this.webpack.dependenciesList.has(path)
        }

        //todo 热更新update事件   发现文件变化执行热更新 (重新生成bundle代码 保存到内存 推送给客户端  客户端eval执行)
        this.watcher.on('change', (path) => {
            if (isDep(path)) {
                console.log(path + '改变,更新模块');
                const bundleCode = this.webpack.createNewBundle([path])
                this.saveBundleToMemo(bundleCode)
                this.wsConnection.send('UPDATE')
            }
        })

        //todo 热更新delete事件  
        this.watcher.on('delete', (path) => {
            if (isDep(path)) {
                console.log(path + '删除,删除模块,重新打包后生效');
            }
        })

        //todo 热更新create事件  
        this.watcher.on('create', (path) => {
            if (!isDep(path)) {
                console.log(path + '创建,新增模块,重新打包后生效');
            }
        })

        this.watcher.watch()
    }

    //! 初始化生成bundle代码
    initBundleCode() {
        this.memoFs = new MemoryFileSystem()
        const bundleCode = this.webpack.buildModules('serverBundle')
        this.saveBundleToMemo(bundleCode)
    }

    //! 写入bundle.js文件到内存中
    saveBundleToMemo(bundleCode) {
        this.memoFs.mkdirpSync("/memoStatic");
        this.memoFs.writeFileSync("/memoStatic/bundle.js", bundleCode);
    }

    //! 推送代码到前端
    sendBundle() {
        const memoBundle = this.memoFs.readFileSync("/memoStatic/bundle.js");
        this.wsConnection.send(memoBundle)
    }


    run() {
        this.initBundleCode()
        this.startServer()
        this.connectWebSocket()
        this.watchFiles()
    }
}


module.exports = WebpackDevServer