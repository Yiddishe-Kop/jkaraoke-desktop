module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: 'yiddishe-kop-protocol://./',
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: 'jKaraoke Desktop',
        appId: 'com.jkaraoke.app',
        mac: {
          icon: 'public/img/app-icon.icns'
        },
        win: {
          icon: 'public/img/app-icon.png'
        }
      }
    }
  }
}
