//todo ------------动态import相关代码   暂时不开发----------------
{
    let requireEnsureStr = `
            
        `
    // 保存了所有已被加载的异步模块
    var installedChunks = {}

    function requireEnsure(chunkId) {  // 这里的chunkId就是absolutePath
        var promises = []
        var installedChunkData = installedChunks[chunkId];

        if (installedChunkData !== 0) { // 0表示已经被加载

            if (installedChunkData) {
                promises.push(installedChunkData[2]);
            } else {

                // 为这个chunk创建一个promise
                // 将该promise的resolve,reject保存到installedChunks中
                var promise = new Promise(function (resolve, reject) {
                    installedChunkData = [resolve, reject];
                    installedChunks[chunkId] = installedChunkData
                });

                // promises数组里添加这个chunk对应的promise
                // 并将promise也保存到installedChunks里 
                // 一个chunk的结构: [resolve,reject,promise]
                installedChunkData[2] = promise
                promises.push(promise)
            }
        }

        return Promise.all(promises)
    }

    function webpackJsonpCallback(moreModules) {
        // 收集所有异步模块中的resolve方法
        Object.keys(installedChunks).forEach((moduleId) => {
            //! 取出后如何将其动态添加到模块对象？
        })
    }
}