#!/usr/bin/env node
const Webpack = require('./core/bundle')
const webpackConfig = require('../../webpack.config')


console.time('lzy-webpack bundle')
const webpack = new Webpack(webpackConfig)
webpack.bundle()
console.timeEnd('lzy-webpack bundle')



