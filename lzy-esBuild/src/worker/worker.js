const { budleAsstes } = require('../bundle_worker.js')
const { workerData, parentPort } = require('worker_threads');


const res = budleAsstes(workerData)

parentPort.postMessage({ result: res, status: 'Done' });