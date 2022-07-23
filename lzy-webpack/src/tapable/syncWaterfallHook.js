class SyncWaterfallHook {
    constructor() {
        this.tasks = [];
    }

    tap(task) {
        if (typeof task === 'function') {
            this.tasks.push(task)
        }
    }

    call(...args) {
        this.tasks.reduce((pre, next) => {
            if (typeof next === 'function') {
                return next(pre, ...args)
            }
        })
    }
}

module.exports = SyncWaterfallHook
