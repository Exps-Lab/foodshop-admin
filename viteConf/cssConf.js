import autoprefixer from 'autoprefixer'

export default {
  preprocessorOptions: {
    less: {
      // 引入SASS全局变量/样式
      // additionalData: `@import '@common/styles/btn_style.less';`,
    },
  },
  postcss: {
    plugins: [
      autoprefixer({
        overrideBrowserslist: [
          'Android 4.1',
          'iOS 7.1',
          'Chrome > 31',
          'ff > 31',
          'ie >= 8',
          "last 10 versions",
        ],
        grid: true,
      })
    ]
  }
}