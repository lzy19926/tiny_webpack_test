class SyncHooks {
    constructor() {
        this.tasks = [];
    }

    tap(task) {
        if (typeof task === 'function') {
            this.tasks.push(task)
        }
    }

    call(...args) {
        this.tasks.forEach((task) => {
            if (typeof task === 'function') {
                task.apply(null, [...args])
            }
        })
    }
}

module.exports = SyncHooks
