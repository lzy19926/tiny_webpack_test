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
        output: {
            beautify: true,// 格式美化
            preamble: "/* -------------------阳九的lzy-mini-webpack---------------------------  */"
        },
        compress: {
            evaluate: true, // 计算常量表达式
            booleans: true, //优化布尔运算
            dead_code: true, // 删除死代码
            unused: true,   // 删除未引用的函数和变量
        },
    }
    return UglifyJS.minify(code, options).code;
}

//! 格式化代码
function justBeautifly(code) {
    const options = {
        annotations: false,
        compress: false,
        expression: false,
        module: false,
        warnings: false,
        mangle: false,
        parse: false,
        toplevel: false,

        output: {
            beautify: true,// 格式美化
            comments: true,
            preserve_line: false,
            preamble: "/* -------------------阳九的lzy-mini-webpack---------------------------  */"
        },
    }
    return UglifyJS.minify(code, options).code;
}


module.exports = { compressByUMinify, compressByUglify, justBeautifly }