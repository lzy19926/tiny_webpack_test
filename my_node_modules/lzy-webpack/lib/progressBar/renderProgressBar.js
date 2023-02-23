const fs = require('fs')
const path = require('path')
const ProgressBar = require('./progressBar')


let step = 0
let allStep = 0
var pb = new ProgressBar('lzy-webpack', 30);

//!--------------- 进度条相关-----------------------

//todo 计算文件夹下所有JS文件数量
function getJsFilesCount(dirPath) {

    let jsFileCount = 0

    const countJSFile = (dirPath) => {
        let filesList = fs.readdirSync(dirPath)
        //判断尾缀为js的文件推入列表  文件夹则递归执行
        filesList.forEach((fileName) => {
            let isDir = fileName.split('.').length === 1
            let suffix = fileName.split('.').pop().toLowerCase();

            if (suffix === 'js') {
                jsFileCount += 1
            } else if (isDir) {
                const childDirPath = dirPath + '/' + fileName
                countJSFile(childDirPath)
            }
        })
    }

    countJSFile(dirPath)

    return jsFileCount
}

//todo 计算进度条总步数
function getProgressCount(entry) {
    let srcPath = path.dirname(entry)
    const jsFileCount = getJsFilesCount(srcPath)
    allStep = (jsFileCount) * 1200 + 1 // 三部分 （构建*8+构建依赖*1+打包模块*1） +  生成依赖图+写入dist
}

//todo 渲染单次进度
function renderProgressBar(text, opt) {
    step += opt?.step || 1
    let total = 100
    let completed = Math.floor((step / allStep * 100))
    // 超出构建数或者完成构建  直接渲染100
    if (completed >= 100 || opt?.done) {
        completed = 100
    }
    pb.render({ completed, total, text });
}


module.exports = { getProgressCount, renderProgressBar }