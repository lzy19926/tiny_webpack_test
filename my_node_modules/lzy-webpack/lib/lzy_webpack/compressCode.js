const UglifyJS = require("uglify-js");
const { minify } = require("terser");



//! 代码压缩相关
async function compressByUMinify(code) {
    var result = await minify(code, {
        compress: {
            dead_code: true,
            drop_console: false, //去除console
        },
        format: {
            comments: 'some' // 去除所有注释
        },
        sourceMap: true, //生成对应的sourceMap
        toplevel: true   //只保留函数计算结果(删除函数 保留引用)

    });

    return result.code
}

function compressByUglify(code) {
    // 压缩配置
    const options = {
        compress: {
            evaluate: true, // 计算常量表达式
            booleans: true, //优化布尔运算
            dead_code: true, // 删除死代码
            unused: true,   // 删除未引用的函数和变量
        },
    }
    return UglifyJS.minify(code, options).code;
}

//todo 未完成  格式化代码
async function beautifly(code) {
    var result = await minify(code, {
        compress: false,
        format: {
            beautify: true
        }
    })
    return result.code
}


module.exports = { compressByUMinify, compressByUglify, beautifly }