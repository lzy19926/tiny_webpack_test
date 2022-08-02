const path = require('path')
const DirectoryWatcher = require('./diractoryWatcher')


const dirPath = path.join(__dirname)
const wp = new DirectoryWatcher({
    directoryList: [dirPath],
    poll: 3000
})

wp.watch()



wp.on('change', (arg) => {
    console.log(arg, 'change');
})
wp.on('remove', (arg) => {
    console.log(arg, 'remove');
})
wp.on('create', (arg) => {
    console.log(arg, 'create');
})