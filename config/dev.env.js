'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// 开发的api
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"/api"' // 开发服务器api
})
