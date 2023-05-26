const Koa = require('koa');
const cors = require('koa2-cors')
const WebSocket = require('ws')
const staticResource = require('koa-static');
const { changeColor } = require('../progressBar/changeColor');
const { checkPort, getStaticPath } = require('./utils')


const CHANGE_EVENT = "change"
const CREATE_EVENT = "create"
const DELETE_EVENT = "delete"

//! devServer流程
// 访问8080  发送index.html到页面  通过script和link标签发请求获取js和css代码
// 同时开启websocket 发送初始hash保存到浏览器
// 后端监听文件变更 重新bundle  计算hash 发送新hash到浏览器
// 浏览器判断hash是否相同  不相同重新刷新页面  随之页面发请求获取bundle


class WebpackDevServer {
    constructor(compiler) {

        // 校验options各字段  
        const devServerConfig = this.validate(compiler)

        this.compiler = compiler
        this.compilation = undefined
        this.config = devServerConfig
        this.watcher = compiler.watchFileSystem  // 文件监视系统
        this.memoFs = compiler.memoFileSystem    // 内存文件系统
        this.staticWatchers = [];
        this.app = undefined                     // koa服务器
        this.wsConnection = undefined            // webSocket链接实例
        this.appMiddleware = []

        this.hash = { // 文件hash
            jsHash: '',
            cssHash: ''
        }

        this.currentHash = undefined;
    }


    // setupConfig
    validate(compiler) {
        const devServerConfig = compiler.config.devServer || {}

        return {
            port: devServerConfig.port,               // 端口
            socketPort: devServerConfig.socketPort,   // 使用的webSocket的端口
            hot: devServerConfig.hot,                 // 启动热更新
            cors: devServerConfig.cors,               // 配置是否能跨域
            staticPath: devServerConfig.staticPath,   // 静态资源托管文件夹
            publicPath: devServerConfig.publicPath    // 读取静态资源的地址(比如localhost:8000) 默认为本服务的端口
        }
    }

    async normailzeOptions() {
        this.config.port = await this.getFreePort(this.config.port)
        this.config.socketPort = await this.getFreePort(this.config.socketPort)
    }

    async start() {
        await this.normailzeOptions()
        await this.initialize()
        this.createServer();
    }

    async startCallback(cb) {
        await this.start()
        cb && cb()
    }


    async initialize() {
        this.setupCompilation();
        this.setupBundleCode()
        this.setupWatchFiles();    // 设置额外文件监听
        this.setupWatchStaticFiles();// 设置额外静态资源监听
        this.setupWSConnect()
        this.setupMiddleware()     // 初始化中间件
    }

    // 获取hostName
    async getHostname() {

    }

    // 获取可用port,默认为8080, 如果端口占用会尝试三次查找其他port
    async getFreePort(port) {
        const basePort = port || 8080
        const defaultPortRetry = 3


        let retry = defaultPortRetry
        let resPort = basePort

        while (retry > 0) {
            if (await checkPort(resPort)) {
                break
            } else {
                resPort++
                retry--
            }
        }

        return resPort
    }

    // 生成浏览器端链接websocket的代码
    getStartServerCode() {
        const webSocketPort = this.config.socketPort
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

    //TODO 开启文件监视系统
    setupWatchFiles() {
        if (!this.watcher) { return console.log("初始化watcherFileSystem失败"); }

        //检查是否是依赖文件
        const isDep = (path) => this.compilation.dependenciesList.has(path)

        //todo 热更新update事件   发现文件变化执行热更新 (重新生成bundle代码 保存到内存 发送hash给客户端  客户端判断hash变更 变更重新拉取新代码)
        const onFileChange = (path) => {
            if (isDep(path)) {
                console.log(path + '改变,更新模块');
                this.updateBundle(CHANGE_EVENT, path)
                this.sendHash()
            }
        }
        //todo 热更新delete事件 
        const onFileCreate = (path) => {
            if (!isDep(path)) {
                console.log(path + '创建,新增模块,重新打包后生效');
            }
        }
        //todo 热更新create事件  
        const onFileDelete = (path) => {
            if (isDep(path)) {
                console.log(path + '删除,删除模块,重新打包');
            }
        }


        // 注册事件
        this.watcher.on('change', onFileChange)
        this.watcher.on('create', onFileCreate)
        this.watcher.on('delete', onFileDelete)


        this.watcher.watch()
    }

    setupWatchStaticFiles() {

    }

    setupCompilation() {
        this.compilation = this.compiler.createCompilation()
    }

    //! 初始化生成bundle代码 存放到内存文件系统中   
    setupBundleCode() {

        this.memoFs.mkdirpSync("/memoStatic");
        this.memoFs.writeFileSync(`/memoStatic/startServer.js`, ' ');
        this.memoFs.writeFileSync(`/memoStatic/bundle.js`, ' ');
        this.memoFs.writeFileSync(`/memoStatic/bundle.css`, ' ');

        const chunks = this.compilation.createChunk()

        for (let [name, chunk] of chunks) {
            const { type, code } = chunk
            if (type == "js") {
                this.memoFs.writeFileSync(`/memoStatic/bundle.js`, code);
                this.hash.jsHash = chunk.getHash()
            }
            if (type == "css") {
                this.memoFs.writeFileSync(`/memoStatic/bundle.css`, code);
                this.hash.cssHash = chunk.getHash()
            }
        }

        const startServerCode = this.getStartServerCode()
        this.memoFs.writeFileSync(`/memoStatic/startServer.js`, startServerCode);
    }

    //TODO 开启webSocket链接
    setupWSConnect() {
        //TODO 创建WebSocketServer到3001端口 (是一个独立的服务)
        //TODO 监听前后端链接事件  回调接收一个connection实例
        let that = this
        let port = that.config.socketPort || 8081

        this.webSocket = new WebSocket.Server({ port });
        this.webSocket.on('connection', function (wsConnection) {
            that.wsConnection = wsConnection
            wsConnection.send(that.hash.jsHash + '-' + that.hash.cssHash)
        });
    }

    setupMiddleware() {
        // 参数
        const shouldCors = this.config.cors
        const staticPath = getStaticPath(this.compiler)

        // cors
        const corsMiddleware = cors()
        if (shouldCors) {
            this.appMiddleware.push(corsMiddleware)
        }

        // 静态资源托管
        const staticMiddleware = staticResource(staticPath)
        this.appMiddleware.push(staticMiddleware)

        // 内存资源托管
        const memoSrcMiddleware = async (ctx) => {
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
        }
        this.appMiddleware.push(memoSrcMiddleware)

    }

    //TODO 开启koa后端服务  托管静态/内存资源
    // 这里模拟了一个动态资源服务器(staticResource是koa静态资源服务器,托管项目public下的文件  可以使用localhost:8080/index.html进行访问)
    // 下面的是模拟的资源服务器   当访问/bundle.js时  发送对应的数据给body  这也是静态资源托管的原理
    createServer() {
        const app = new Koa();
        const port = this.config.port

        this.appMiddleware.forEach(middleware => {
            app.use(middleware)
        })

        app.listen(port, () => {
            console.log(changeColor(`\n\n dev-server启动在: ${changeColor(`http://localhost:${port}`, 96)} `, 92));
        })

        this.app = app
    }

    //! 更新js/css的bundle代码并更新对应的hash
    updateBundle(event, path) {
        switch (event) {
            case CHANGE_EVENT:

                const module = this.compilation.modules.get(path)
                if (module.type == "javascript") {
                    const prevModuleHash = this.compilation.modules.get(path).getHash()
                    const nextModuleHash = this.compilation.updateModule(path).getHash()

                    //更新模块所在的chunk
                    if (prevModuleHash != nextModuleHash) {
                        const chunk = module.getChunk()
                        this.compilation.hooks.BundleSync.call(chunk) // rebuild Chunk
                        chunk.update()
                        this.memoFs.writeFileSync(`/memoStatic/bundle.js`, chunk.code);
                        this.hash.jsHash = chunk.getHash()
                    }
                }
                else if (module.type == "css") {
                    const chunk = this.compilation.config.plugins[1].outputCSS(this.compilation)
                    this.memoFs.writeFileSync(`/memoStatic/bundle.css`, chunk.code);
                    this.hash.cssHash = chunk.getHash()
                }
                break
            case CREATE_EVENT:
                break
            case DELETE_EVENT:
                break
        }

    }

    //TODO 发送给前端合成hash
    sendHash() {
        const hash = this.hash.jsHash + '-' + this.hash.cssHash
        if (this.wsConnection) {
            this.wsConnection.send(hash)
            console.log('本次热更新hash', hash);
        }
    }
}


module.exports = WebpackDevServer

