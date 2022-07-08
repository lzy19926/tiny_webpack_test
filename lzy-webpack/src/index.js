#!/usr/bin/env node
const Webpack = require('./bundle')
const webpackConfig = require('../../webpack.config')

const webpack = new Webpack(webpackConfig)
webpack.bundle()



