//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userList: []
  },
  onLoad: function (options) {
    let _t = this;
    app.editTabBar();
    _t.getChatList();
  },
  gotoChatView(e){
    let _t = this;
    let oppositeUserId = e.currentTarget.dataset.userid;
    let sex = e.currentTarget.dataset.sex;
    wx.navigateTo({
      url: '../chatView/chatView?talkToUserId=' + oppositeUserId + '&talkToUserSex=' + sex
    });
  },
  getChatList(){
    let _t = this;
    app.actions.getChatListApi(app.globalData.user.userId, 1, 100).then(json => {
      if (json.code != 0) {
        wx.showModal({
          showCancel: false,
          content: json.message
        })
       return; 
      }
      let userChatDTOList = json.data.userChatDTOList;
      userChatDTOList.map((item, index) => {
        item.chatDuration = _t.formatTime(item.chatDuration)
      })
      _t.setData({
        // userList: userChatDTOList
        userList: json.data.userChatDTOList
      })
    })
  },
  formatTime(seconds) {
    return [
      parseInt(seconds / 60 / 60),
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
  }
})
