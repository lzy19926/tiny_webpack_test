

const { DirectoryWatcher } = require('lzy-watchpack')
const path = require('path')




function watchFiles(webpack, wsConnection) {
    //todo 创建文件监视器
    const srcPath = path.resolve(webpack.config.entry, '..')
    const watcher = new DirectoryWatcher({
        directoryList: [srcPath],
        poll: 3000
    })

    const isDep = (path) => {//检查是否是依赖文件
        return webpack.dependenciesList.has(path)
    }

    //todo 热更新update事件   发现文件变化执行热更新 (重新生成bundle代码 推送给客户端  客户端eval执行)
    watcher.on('change', (path) => {
        if (isDep(path)) {
            console.log(path + '改变,更新模块');
            const newModuleStr = webpack.createNewModuleStr(path)
            const dataStr = `{event:'update',data:${newModuleStr}}`
            wsConnection.send(dataStr);
        }
    })

    //todo 热更新delete事件  
    watcher.on('delete', (path) => {
        if (isDep(path)) {
            console.log(path + '删除,删除模块');
            const dataStr = `{event:'delete',data:${path}}`
            wsConnection.send(dataStr);
        }
    })

    //todo 热更新create事件  
    watcher.on('create', (path) => {
        if (!isDep(path)) {
            console.log(path + '创建,新增模块');
            const newModuleStr = webpack.createNewModuleStr(path)
            const dataStr = `{event:'create',data:${newModuleStr}}`
            wsConnection.send(dataStr);
        }
    })



    watcher.watch()
}

module.exports = { watchFiles }


