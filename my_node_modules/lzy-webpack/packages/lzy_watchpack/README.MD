## 一个专门为lzy-webpack开发的用于监控文件变化的包 
``
const { DirectoryWatcher } = require('lzy-watchpack')

const wp = new DirectoryWatcher({
    directoryList: [dirPath], //传入需要监听的文件夹(绝对路径)
    poll: 3000                //扫描间隔时间
})


// 定义文件change  remove  create时的回调    
wp.on('change', (path) => {
    console.log(path, 'change');
})
wp.on('remove', (path) => {
    console.log(path, 'remove');
})
wp.on('create', (path) => {
    console.log(path, 'create');
})

// 开/关监听器
wp.watch()
wp.stopWatch()
``