//logger
class Logger {

    constructor() {
        this.isOpen = false
    }

    log(...args) {
        this.isOpen && console.log("[LZY-WEBPACK-INFO]:", ...args)
    }

    error(...args) {
        console.error("[LZY-WEBPACK-ERROR]:", ...args)
    }

    warn(...args) {
        console.warn("[LZY-WEBPACK-WARN]:", ...args)
    }

    open() {
        this.isOpen = true
    }

    close() {
        this.isOpen = false
    }
}


const logger = new Logger()

module.exports = { logger }

