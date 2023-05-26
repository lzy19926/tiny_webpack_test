const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const Watcher = require('./fileWatcher');
const { emit } = require('process');

// 获取两个数组不同项
function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}


const handler = new EventEmitter()

class DirectoryWatcher extends EventEmitter {
    constructor(option, handler) {
        super();
        this.handler = handler //! ------
        this.fileList = option.fileList || [];
        this.directoryList = option.directoryList || [];
        this.watchers = new Map();
        this.pause = false;
        this.poll = (typeof option.poll === "number") ? option.poll : 5007;
        this.scanTimeout = undefined;
        this.scanTime = 0
    }


    //todo 递归收集文件夹下所有的文件
    collectFiles(pathList) {
        const files = []

        const cycleFn = (pathList) => {
            pathList.forEach(p => {
                const stat = fs.statSync(p)
                if (stat.isFile()) {
                    files.push(p)
                }
                if (stat.isDirectory()) {
                    const childPathList = fs.readdirSync(p).map((childPath) => {
                        return path.join(p, childPath)
                    })
                    cycleFn(childPathList)
                }
            })
        }
        cycleFn(pathList)

        return files
    }

    //todo 检查哪些文件需要挂载watcher
    checkNeedWatcherFiles() {
        const newFileList = this.collectFiles(this.directoryList)
        const needWatcherFiles = getArrDifference(this.fileList, newFileList)
        this.fileList = newFileList
        return needWatcherFiles
    }

    //todo 更新watchers
    updateWatchers() {
        const needWatcherFiles = this.checkNeedWatcherFiles()
        needWatcherFiles.forEach((path) => {
            this.watchers.set(path, new Watcher(this, path))
        })
    }

    doScan() {
        if (this.pause) return
        this.updateWatchers()
        this.forEachWatchers()
        this.scanTime++
    }

    forEachWatchers() {
        this.watchers.forEach((w, key) => {
            w.checkEvent()
        })
    }

    watch() {
        console.log('--------------正在监视--------------------');
        console.log(this.directoryList);
        this.scanInerval = setInterval(() => {
            this.doScan()
        }, this.poll)
    }

    stopWatch() {
        clearInterval(this.scanInerval)
    }

}

module.exports = DirectoryWatcher