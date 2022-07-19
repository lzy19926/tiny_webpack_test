#!/usr/bin/env node
const { startServer } = require('./core/startServer')
const webpackConfig = require('../../webpack.config')

startServer(webpackConfig)
