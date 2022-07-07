const UglifyJS = require("uglify-js");

//!  启动代码压缩

// 压缩配置
const options = {
    compress: {
        evaluate: true, // 计算常量表达式
        booleans: true, //优化布尔运算
        dead_code: true, // 删除死代码
        unused: true,   // 删除未引用的函数和变量
    },
}

function compress(code) {
    return UglifyJS.minify(code, options).code;
}

module.exports = { compress }