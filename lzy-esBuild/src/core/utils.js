//todo 定义终端打印字体颜色
function changeColor(input, color = 95) {
    return `\x1b[${color}m${input}\x1b[0m`
}

module.exports = { changeColor }