
/**
 * 检查文件后缀
*/
function getFileType(absolutePath) {

    const isJSFile = /\.js$/.test(absolutePath)
        || /\.ts$/.test(absolutePath)
        || /\.cjs$/.test(absolutePath)
        || /\.mjs$/.test(absolutePath)
        || /\.jsx$/.test(absolutePath)
        || /\.tsx$/.test(absolutePath)
    const isLzyFile = /\.lzy$/.test(absolutePath)

    const isCSSFile = /\.css$/.test(absolutePath)
        || /\.scss$/.test(absolutePath)
        || /\.less$/.test(absolutePath)


    if (isJSFile || isLzyFile) return "javascript"
    else if (isCSSFile) return "css"
    else return console.error("unknow file type")
}



// 添加文件后缀
function addFileSuffix(path) {

    const needHandle = !(path[0] !== '.' && path[1] !== ':')

    if (needHandle) {
        var index = path.lastIndexOf(".");
        var ext = path.substr(index + 1);

        if (ext.length > 5) {
            path = path + '.js'
        }
    }

    return path
}


module.exports = { getFileType, addFileSuffix }