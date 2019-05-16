//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
    muted: false  // 是否静音
  },
  onLoad: function (options) {
    app.editTabBar();

  }
})
