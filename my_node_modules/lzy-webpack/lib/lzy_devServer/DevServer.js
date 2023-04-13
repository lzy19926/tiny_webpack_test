const path = require('path')
const Koa = require('koa');
const cors = require('koa2-cors')
const WebSocket = require('ws')
const SparkMD5 = require('spark-md5')
const staticResource = require('koa-static');
const { changeColor } = require('../progressBar/changeColor');

class DevServer {
    constructor(compiler) {
        this.compiler = compiler
        this.config = compiler.config
        this.app = undefined     // koa服务器
        this.wsConnection = undefined  // webSocket链接实例


        this.watcher = compiler.watchFileSystem  // 文件监视系统
        this.memoFs = compiler.memoFileSystem  // 内存文件系统


        this.hash = { // 文件hash
            jsHash: '',
            cssHash: ''
        }
        this.watchedFileType = { // 监听需要变更的文件后缀
            js: ['js', 'lzy', 'jsx'],
            css: ['css', 'less', 'scss']
        }
    }


    //TODO 开启koa后端服务  托管静态/内存资源
    // 这里模拟了一个动态资源服务器(staticResource是koa静态资源服务器,托管项目public下的文件  可以使用localhost:8080/index.html进行访问)
    // 下面的是模拟的资源服务器   当访问/bundle.js时  发送对应的数据给body  这也是静态资源托管的原理
    startServer() {
        const app = new Koa();
        const shouldCors = this.config?.devServer?.cors || false
        const port = this.config?.devServer?.port || 8080
        const staticPath = path.join(this.config.rootPath, this.config?.devServer?.staticPath) || path.join(this.config.rootPath, 'public')

        if (shouldCors) {
            app.use(cors())
        }

        app.use(staticResource(staticPath))

        // 将内存中的js css文件托管到服务器
        app.use(async (ctx) => {
            if (ctx.url === '/bundle.js') {
                ctx.set('Content-Type', 'application/javascript')
                ctx.body = this.memoFs.readFileSync("/memoStatic/bundle.js")
            }
            if (ctx.url === '/bundle.css') {
                ctx.set('Content-Type', 'text/css')
                ctx.body = this.memoFs.readFileSync("/memoStatic/bundle.css");
            }
            if (ctx.url === '/startServer.js') {
                ctx.set('Content-Type', 'application/javascript')
                ctx.body = this.memoFs.readFileSync("/memoStatic/startServer.js")
            }
        })

        app.listen(port, () => {
            console.log(changeColor(`\n\n dev-server启动在: ${changeColor(`http://localhost:${port}`, 96)} `, 92));
        })

        this.app = app
    }

    // 生成浏览器端链接websocket的代码
    initClientCodeForStartServer() {
        const webSocketPort = this.config?.devServer?.socketPort || 8081
        return `
               (function () {
                   console.warn("热更新准备就绪,正在监听文件, webSocketPort:${webSocketPort}")
                   var bundleHash = ''
                   var ws = new WebSocket("ws://localhost:${webSocketPort}/");
                   ws.onmessage = function ({ data }) {
                       if (bundleHash && bundleHash !== data) return location.reload()
                       bundleHash = data
                   }
               })()
               `
    }

    //TODO 开启webSocket链接
    connectWebSocket() {
        //TODO 创建WebSocketServer到3001端口 (是一个独立的服务)
        //TODO 监听前后端链接事件  回调接收一个connection实例
        let that = this
        let port = that.config?.devServer?.socketPort || 8081

        this.webSocket = new WebSocket.Server({ port });
        this.webSocket.on('connection', function (wsConnection) {
            that.wsConnection = wsConnection
            wsConnection.send(that.hash.jsHash + '-' + that.hash.cssHash)
        });
    }

    //TODO 开启文件监视系统
    watchFiles() {
        if (!this.watcher) { return console.log("初始化watcherFileSystem失败"); }
        
        //检查是否是依赖文件
        const isDep = (path) => this.compiler.dependenciesList.has(path)

        //todo 热更新update事件   发现文件变化执行热更新 (重新生成bundle代码 保存到内存 发送hash给客户端  客户端判断hash变更 变更重新拉取新代码)
        this.watcher.on('change', (path) => {
            if (isDep(path)) {
                console.log(path + '改变,更新模块');
                this.updateBundle(path)
                this.sendHash()
            }
        })

        //todo 热更新delete事件  
        this.watcher.on('delete', (path) => {
            if (isDep(path)) {
                console.log(path + '删除,删除模块,重新打包');
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

    //! 初始化生成bundle代码 存放到内存文件系统中   
    initBundleCode() {
        this.memoFs.mkdirpSync("/memoStatic");
        this.memoFs.writeFileSync(`/memoStatic/startServer.js`, ' ');
        this.memoFs.writeFileSync(`/memoStatic/bundle.js`, ' ');
        this.memoFs.writeFileSync(`/memoStatic/bundle.css`, ' ');


        const bundleCode = this.compiler.createBundle('serverBundle')
        const bundleCSS = this.compiler.config.plugins[1].bundleCSS(this.compiler)
        const startServerCode = this.initClientCodeForStartServer()

        if (startServerCode) {
            this.memoFs.writeFileSync(`/memoStatic/startServer.js`, startServerCode);
        }

        if (bundleCode) {
            this.memoFs.writeFileSync(`/memoStatic/bundle.js`, bundleCode);
            this.hash.jsHash = this.caculateHash('/memoStatic/bundle.js')
        }

        if (bundleCSS) {
            this.memoFs.writeFileSync(`/memoStatic/bundle.css`, bundleCSS);
            this.hash.cssHash = this.caculateHash('/memoStatic/bundle.css')
        }
    }

    //! 更新js/css的bundle代码并更新对应的hash
    updateBundle(path) {
        const suffix = path.substr(path.lastIndexOf(".") + 1);
        const needBundle = this.watchedFileType.js.indexOf(suffix) !== -1
        const needBundleCss = this.watchedFileType.css.indexOf(suffix) !== -1

        if (needBundle) {
            const jsCode = this.compiler.createNewBundle(path)
            this.memoFs.writeFileSync(`/memoStatic/bundle.js`, jsCode);
            this.hash.jsHash = this.caculateHash('/memoStatic/bundle.js')
        }
        if (needBundleCss) {
            const cssCode = this.compiler.config.plugins[1].bundleCSS(this.compiler)
            this.memoFs.writeFileSync(`/memoStatic/bundle.css`, cssCode);
            this.hash.cssHash = this.caculateHash('/memoStatic/bundle.css')
        }
    }

    //TODO 计算文件hash(内存)
    caculateHash(path) {
        const spark = new SparkMD5()
        const buffer = this.memoFs.readFileSync(path);
        spark.append(buffer)
        const hash = spark.end()
        return hash
    }

    //TODO 发送给前端合成hash
    sendHash() {
        const hash = this.hash.jsHash + '-' + this.hash.cssHash
        if (this.wsConnection) {
            this.wsConnection.send(hash)
            console.log('本次热更新hash', hash);
        }
    }

    run() {
        this.initBundleCode()
        this.startServer()
        this.connectWebSocket()
        this.watchFiles()
    }
}


module.exports = DevServer


//! devServer流程
// 访问8080  发送index.html到页面  通过script和link标签发请求获取js和css代码
// 同时开启websocket 发送初始hash保存到浏览器
// 后端监听文件变更 重新bundle  计算hash 发送新hash到浏览器
// 浏览器判断hash是否相同  不相同重新刷新页面  随之页面发请求获取bundle