#!/usr/bin/env node
// 两种不同的遍历算法  
const { bundle } = require('./core/bundle_1') // 递归遍历
// const { bundle2 } = require('./core/bundle_2') // 队列遍历
// const { workerBundle } = require('./core/bundle_worker')// node多线程

bundle()
// bundle2()
// workerBundle()

