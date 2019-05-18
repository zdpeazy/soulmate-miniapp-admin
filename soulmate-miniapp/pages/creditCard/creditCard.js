//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showModel: false
  },
  onLoad: function (options) {
  },
  handlerModel() {
    this.setData({
      showModel: true
    })
  },
  handlerClose(){
    this.setData({
      showModel: false
    })
  },
  handlerSend(){
    this.setData({
      showModel: false
    })
  }
})
