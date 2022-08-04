const fs = require('fs')
const EventEmitter = require('events')

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

module.exports = Watcher