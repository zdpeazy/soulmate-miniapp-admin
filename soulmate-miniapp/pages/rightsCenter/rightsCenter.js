//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    let _t = this;
    _t.getUserInfo();
  },
  gotoEdit() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },
  getUserInfo() {
    let _t = this;
    app.actions.getUserInfoApi(app.globalData.user.userId)
      .then(json => {
        if (json.code == 0) {
          _t.setData({
            userInfo: json.data
          })
        }
      })
  }
})
