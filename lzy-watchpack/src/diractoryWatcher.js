const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const path = require("path");



// 获取两个数组不同项
function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}

class Watcher extends EventEmitter {
    constructor(directoryWatcher, path) {
        super();
        this.filePath = path;
        this.saveTime = 1;
        this.watchers = directoryWatcher.watchers
        this.directoryWatcher = directoryWatcher
    }

    checkTime() {
        fs.lstat(this.filePath, (err, state) => {
            if (!this.saveTime && !state) return console.error(`文件${this.filePath}不存在`)

            //TODO 如果文件被删除  触发remove事件并删除该watcher
            if (this.filePath && !state) {
                this.directoryWatcher.emit('remove', this.filePath, 'remove')
                this.watchers.delete(this.filePath)
                return
            }

            const saveTime = Math.floor(state.ctimeMs)
            //TODO 文件添加
            if (this.saveTime === 1 && this.directoryWatcher.scanTimes > 1) {
                this.directoryWatcher.emit('create', this.filePath, 'create')
            }
            //TODO 文件修改  触发change事件
            if (this.saveTime !== 1 && saveTime !== this.saveTime) {
                this.directoryWatcher.emit('change', this.filePath, 'change')
            }
            this.saveTime = saveTime

        })
    }

}


class DirectoryWatcher extends EventEmitter {
    constructor(option) {
        super();
        this.fileList = option.fileList || [];
        this.directoryList = option.directoryList || [];
        this.watchers = new Map();[]
        this.scanTimes = 0
        this.pause = false;
        this.poll = (typeof option.poll === "number") ? option.poll : 5007;
        this.scanTimeout = undefined;
    }


    //todo 收集所有文件夹？？？？
    collectDiractories() {
        for (let dir of this.directoryList) {

        }
    }

    //todo 递归收集文件夹下所有的文件
    collectFiles(pathList) {
        const files = []

        const cycleFn = (pathList) => {
            pathList.forEach(absPath => {
                const stat = fs.statSync(absPath)
                if (stat.isFile()) {
                    files.push(absPath)
                }
                if (stat.isDirectory()) {
                    const childPathList = fs.readdirSync(absPath).map((chPath) => {
                        return path.join(absPath, chPath)
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

    createWatchers(fileList) {
        fileList.forEach(filePath => {//! 传入this 因为继承了eventEmitter,this同时也是eventPool
            this.watchers.set(filePath, new Watcher(this, filePath))
        });
    }

    updateWatcher(path) {
        this.watchers.delete(path)
        this.watchers.set(path, new Watcher(this, filePath))
    }

    removeWatcher(path) {
        this.watchers.delete(path)
    }

    doScan() {
        if (this.pause) return

        this.scanInerval = setInterval(() => {
            console.time('scan');
            const needWatcherFiles = this.checkNeedWatcherFiles()
            this.createWatchers(needWatcherFiles)
            this.scanFiles()
            this.scanTimes++
            console.timeEnd('scan');
        }, this.poll)
    }

    scanFiles() {
        this.watchers.forEach((w, key) => {
            w.checkTime()
        })
    }

    watch() {
        console.log('--------------正在监视--------------------');
        this.doScan()
    }

    stopWatch() {
        clearInterval(this.scanInerval)
    }

}















const dirPath = path.join(__dirname)

const wp = new DirectoryWatcher({
    directoryList: [dirPath],
    poll: 3000
})


wp.watch()

wp.on('change', (arg) => {
    console.log(arg, 'change');
})

wp.on('remove', (arg) => {
    console.log(arg, 'remove');
})

wp.on('create', (arg) => {
    console.log(arg, 'create');
})