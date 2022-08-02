const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const path = require("path");


class Watcher extends EventEmitter {
    constructor(directoryWatcher, path) {
        super();
        this.filePath = path;
        this.saveTime = 1;
        this.watchers = directoryWatcher.watchers
        this.eventPool = directoryWatcher
    }

    checkTime() {
        fs.lstat(this.filePath, (err, state) => {
            console.log(state);
            if (!this.saveTime && !state) return console.error(`文件${this.filePath}不存在`)

            //TODO 如果文件被删除  触发remove事件并删除该watcher
            if (this.filePath && !state) {
                this.eventPool.emit('remove', this.filePath, 'remove')
                this.watchers.delete(this.filePath)
                return
            }
            //TODO 文件修改  触发change事件
            const saveTime = Math.floor(state.ctimeMs)
            if (saveTime !== this.saveTime) {
                this.eventPool.emit('change', this.filePath, 'change')
                this.saveTime = saveTime
            }

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
        this.poll = option.poll || 5000;
        this.scanTimeout = undefined;
    }

    //todo 递归收集文件夹下所有的文件
    collectFiles(pathList) {
        pathList.forEach(absPath => {
            const stat = fs.statSync(absPath)
            if (stat.isFile()) {
                this.fileList.push(absPath)
            }
            if (stat.isDirectory()) {
                const childPathList = fs.readdirSync(absPath).map((chPath) => {
                    return path.join(absPath, chPath)
                })
                this.collectFiles(childPathList)
            }
        })
    }


    createWatcher() {
        this.fileList.forEach(filePath => {
            this.watchers.set(filePath, new Watcher(this, filePath)) //! 传入this 因为继承了eventEmitter,this同时也是eventPool
        });
    }

    doScan() {
        if (this.pause) return
        this.scanInerval = setInterval(() => {
            console.time('scan');
            this.scanFiles()
            console.timeEnd('scan');
        }, this.poll)
    }

    scanFiles() {
        this.watchers.forEach((w, key) => {
            w.checkTime()
        })
    }

    watch() {
        this.collectFiles(this.directoryList)
        console.log('--------------正在监视--------------------');
        console.log(this.fileList);
        this.createWatcher()
        this.doScan()
    }

    stopWatch() {
        clearInterval(this.scanInerval)
    }

}


const dirPath = path.join(__dirname)

const wp = new DirectoryWatcher({
    directoryList: [dirPath],
    poll: 2000
})




wp.watch()

wp.on('change', (arg) => {
    console.log(arg, 'change');
})

wp.on('remove', (arg) => {
    console.log(arg, 'remove');
})


setTimeout(() => {
    wp.stopWatch()
}, 30000)