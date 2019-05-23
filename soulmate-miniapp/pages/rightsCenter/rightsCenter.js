//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    chatMatchCount: 0,
    rights: [],
  },
  onLoad: function (options) {
    let _t = this;
    _t.getUserInfo();
    _t.getRights();
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
  },
  getRights(){
    let _t = this;
    app.actions.getMyRights(app.globalData.user.userId)
      .then(json => {
        if (json.code == 0) {
          _t.setData({
            chatMatchCount: json.data.chatMatchCount,
            rights: pushRight(json.data.rightConfigDTOList)
          })
        }
        function pushRight(rights){
          const res = {};
          rights.forEach(item => {
            res[item.code] = item;
          });
          return res;
        }
      })
  }
})
