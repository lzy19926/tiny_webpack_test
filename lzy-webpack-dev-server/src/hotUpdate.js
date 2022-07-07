
const fs = require('fs')
const path = require('path')
const WebSocket = require('ws')
const MemoryFileSystem = require("memory-fs");
var memoFs = new MemoryFileSystem()


//! 写一个bundle.js文件到内存中
// function saveBundleToMemo(result) {
//     memoFs.mkdirpSync("/memoStatic");
//     memoFs.writeFileSync("/memoStatic/bundle.js", result);
//     // const res = memoFs.readFileSync("/memoStatic/bundle.js");
//     // console.log(res);
// }


function hotUpdate(webpack) {
    //TODO 创建WebSocketServer到3001端口 (是一个独立的服务)
    const ws = new WebSocket.Server({ port: 3001 });

    //! 监听前后端链接事件  回调接收一个connection实例
    ws.on('connection', function (connection) {
        console.log('websocket连接成功,热更新准备就绪');
        const srcPath = path.resolve(webpack.config.entry, '..')

        //todo 热更新回调  发现文件变化执行热更新 (重新生成bundle代码 推送给客户端  客户端eval执行)
        const hotUpdateCb = (path) => {
            const newBundleCode = webpack.createBundleCode()
            connection.send(newBundleCode);
            console.log('热更新结束');
        }

        //todo 监听某个文件/文件夹的变化 这里监听文件夹下所有文件的变化 执行回调
        watchFileChange(srcPath, hotUpdateCb)
    });
}


// 通过绝对路径监听文件内容变化
let lastEditTime;
function watchFileChange(absolutePath, callback) {
    console.log(`正在监听 ${absolutePath}`);

    fs.watch(absolutePath, { recursive: true }, (event, filename) => {

        //! 通过检查文件的修改时间判断文件是否修改(需要判断是否删除文件)(需要获取src目录)
        var filePath = absolutePath + '/' + filename
        var hasFile = fs.existsSync(filePath)
        if (!hasFile) return

        //! 文件时间精确到100ms
        var status = fs.statSync(filePath)
        var editTimeStr = status.mtimeMs.toString()
        var editTime = editTimeStr.slice(0, editTimeStr.length - 8)
        if (editTime == lastEditTime) return
        lastEditTime = editTime

        //! 执行代码
        if ( filename) {
            const filePath = path.join(absolutePath, filename)
            console.log(`${filePath}文件发生更新,启动热更新`)
            callback(filePath)
        }
    })
}

module.exports = { hotUpdate }

