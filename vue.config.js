const { defineConfig } = require('@vue/cli-service')
const publicPath = process.env.NODE_ENV === 'production'
  ? (process.env.GITHUB_ACTIONS ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1] + '/' : '/')
  : '/';

console.log('Public Path:', publicPath);

module.exports = {
  transpileDependencies: true,
  publicPath: publicPath
}