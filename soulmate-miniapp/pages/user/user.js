//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    fansList: []
  },
  onLoad: function (options) {
    let _t = this;
    app.editTabBar();
    _t.getUserInfo();
    _t.getFansList();
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
  gotoMyFans(){
    wx.navigateTo({
      url: '../myFans/myFans',
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
  },
  getFansList(){
    let _t = this;
    app.actions.getMyFans(app.globalData.user.userId, 1, 4)
      .then(json => {
        if (json.code == 0) {
          _t.setData({
            fansList: json.data.likeMeUserIdList.slice(0, 4)
          });
        }
      });
  }
})
