#!/usr/bin/env node
// 两种不同的遍历算法  
const { bundle } = require('./bundle_1') // 递归遍历
const { bundle2 } = require('./bundle_2') // 队列遍历
const { workerBundle } = require('./bundle_worker')// node多线程

bundle()
// bundle2()
// workerBundle()

