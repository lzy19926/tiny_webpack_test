#!/usr/bin/env node
const Webpack = require('../lzy_webpack/webpackCompiler')
const webpackConfig = require('../../../../webpack.config')


const webpack = new Webpack(webpackConfig)

webpack.bundle()




