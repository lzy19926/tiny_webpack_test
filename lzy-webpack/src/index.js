#!/usr/bin/env node
const Webpack = require('./bundle')
const webpackConfig = require('../../webpack.config')

const webpack = new Webpack(webpackConfig)





console.time('lzy-webpack bundle')
webpack.bundle()
console.timeEnd('lzy-webpack bundle')



