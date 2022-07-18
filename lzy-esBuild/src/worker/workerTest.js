const { Worker } = require('worker_threads');
const path = require('path')

// 分割数组为多个数组
function chunkArray(arr, chunkCount) {
    const chunkLength = Math.ceil(arr.length / chunkCount)
    const res = []
    for (let i = 0; i < chunkCount; i++) {
        const arrPart = []
        for (let k = 0; k < chunkLength; k++) {
            const item = arr.shift()
            if (item) { arrPart.push(item) }
        }
        res.push(arrPart)
    }
    return res
}


const runSerice = (workerData) => {
    return new Promise((resolve, reject) => {
        const workerPath = path.join(__dirname, './worker.js')
        const worker = new Worker(workerPath, { workerData });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker Thread stopped with exit code ${code}`));
        });
    });
};

const run = async (assetsList, workerCount) => {
    const assetsChunks = chunkArray(assetsList, 2)
    const result = await runSerice(assetsChunks[0]);
    const result2 = await runSerice(assetsChunks[1]);
    const resCode = result2.result + result.result
    return resCode
};


module.exports = { run }