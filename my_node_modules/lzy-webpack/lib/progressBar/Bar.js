const fs = require('fs')
const path = require('path')
const ProgressBar = require('./progressBar')

//!--------------- 进度条相关-----------------------
class Bar {
    constructor() {
        this.pb = new ProgressBar('lzy-webpack', 30)
        this.step = 0
        this.allStep = 0
    }

    //todo 渲染单次进度
    render(text, opt) {
        this.step += opt?.step || 1
        let total = 100
        let completed = Math.floor((this.step / this.allStep * 100))
        // 超出构建数或者完成构建  直接渲染100
        if (completed >= 100 || opt?.done) {
            completed = 100
        }
        this.pb.render({ completed, total, text });
    }
}

module.exports = Bar