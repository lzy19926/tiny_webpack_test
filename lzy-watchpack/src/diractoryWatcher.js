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
        this.directoryWatcher = directoryWatcher
    }

    checkEvent() {
        fs.lstat(this.filePath, (err, state) => {
            if (!this.saveTime && !state) return console.error(`文件${this.filePath}不存在`)

            let saveTime = Math.floor(state?.ctimeMs)
            //TODO 如果文件被删除  触发remove事件并删除该watcher
            if (this.filePath && !state) {
                this.directoryWatcher.emit('remove', this.filePath, 'remove')
                this.directoryWatcher.watchers.delete(this.filePath)
                return
            }
            //TODO 文件添加
            if (this.saveTime === 1 && this.directoryWatcher.scanTime > 1) {
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
            console.time('SCAN')
            this.doScan()
            console.timeEnd('SCAN')
        }, this.poll)
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