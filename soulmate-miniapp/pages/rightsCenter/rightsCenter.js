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
  copyWxNum(){
    wx.setClipboardData({
      data: '1756494442',
      success(res) {
        wx.showToast({
          title: '客服微信复制成功，请到微信添加',
          icon: 'none'
        })
      }
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
  },
  onShareAppMessage(res) {
    return {
      title: '解决尬聊问题，实现深度沟通',
      path: '/index/index'
    }
  }
})
