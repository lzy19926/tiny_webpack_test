const net = require('net');
const path = require('path')
/**
 *检查某个端口是否可用（空闲）
*/
function checkPort(port) {
    return new Promise((resolve, reject) => {
        try {
            const server = net.createServer();

            server.once('error', (err) => {
                if (err.code === 'EADDRINUSE') { // 端口已被占用
                    console.log(`The port ${port} is occupied.`);
                    resolve(false)
                }
            });

            server.listen(port, () => {
                // 及时关闭可避免增加系统负担
                server.close();
                resolve(true)
            });

        } catch (err) {
            reject(err)
        }
    })

}


/**
 * 获取静态资源存放路径
*/
function getStaticPath(compiler) {
    const basePublic = path.join(compiler.config.rootPath, 'public')
    const customPublic = path.join(compiler.config.rootPath, compiler.config?.devServer?.staticPath)

    return customPublic || basePublic
}


module.exports = { checkPort,getStaticPath }