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
        if (!this.tasks.length) return

        this.tasks.reduce((pre, next) => {
            if (typeof next === 'function') {
                return next(pre, ...args)
            }
        })
    }
}

module.exports = SyncWaterfallHook
