// 使用静态资源方法()
const nodePath = require('path')
const webpackConfig = require('../../../../webpack.config')

function importStatic(path) {

    let staticPath = webpackConfig?.devServer?.staticPath
    let publicPath = webpackConfig?.devServer?.publicPath
    let staticDir = nodePath.basename(staticPath)
    let resPath = path.toString()

    //删除路径中的 ./  ../
    while (resPath.startsWith('/') || resPath.startsWith('./') || resPath.startsWith('../')) {
        if (resPath.startsWith('/')) {
            resPath = resPath.slice(1)
        }
        if (resPath.startsWith('./')) {
            resPath = resPath.slice(2)
        }
        if (resPath.startsWith('../')) {
            resPath = resPath.slice(3)
        }
    }

    //删除路径中的/public(根据静态资源文件名配置)
    if (resPath.startsWith(staticDir)) {
        resPath = resPath.slice(staticDir.length)
    }

    // 如果配置了publicPath  替换请求静态资源地址 
    if (publicPath && publicPath.length > 0) {

        if (publicPath.startsWith('http://') || publicPath.startsWith('https://')) {
            resPath = publicPath + resPath
        } else {
            console.warn('publicPath需要以 http:// 或 https:// 为开头')
        }
    }

    return resPath
}

module.exports = { importStatic }