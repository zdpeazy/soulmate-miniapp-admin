//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad: function (options) {
    let _t = this;
    app.editTabBar();
    _t.getUserInfo();
  },
  gotoEdit(){
    wx.navigateTo({
      url: '../edit/edit',
    })
  },
  gotoRightCenter(){
    wx.navigateTo({
      url: '../rightsCenter/rightsCenter',
    })
  },
  gotoCreditCard(){
    wx.navigateTo({
      url: '../creditCard/creditCard',
    })
  },
  getUserInfo() {
    let _t = this;
    app.actions.getUserInfoApi(app.globalData.user.userId)
      .then(json => {
        if (json.code == 0) {
          let icon = json.data.icon, iconArr = [];
          if (icon) {
            iconArr = icon.split(',')
          }
          _t.setData({
            userInfo: json.data,
            imgUrls: iconArr
          })
        }
      })
  }
})
