// pages/webview/webview.js
Page({

  data: {
    url: ''
  },

  onLoad: function (options) {
    this.setData({
      url: options.url
    })
  },

})