const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? (process.env.GITHUB_ACTIONS ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1] + '/' : '/')
    : '/',
  transpileDependencies: true
})
