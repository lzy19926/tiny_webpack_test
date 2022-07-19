#!/usr/bin/env node
const Webpack = require('./core/bundle')
const webpackConfig = require('../../webpack.config')
const { changeColor } = require('./progressBar/utils')

console.time(changeColor('lzy-webpack打包用时', 91))
const webpack = new Webpack(webpackConfig)
webpack.bundle()
console.timeEnd(changeColor('lzy-webpack打包用时', 91))



