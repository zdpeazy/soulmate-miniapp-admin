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
    console.log(e.currentTarget.dataset.userid)
    let _t = this;
    let oppositeUserId = e.currentTarget.dataset.userid;
    app.actions.chartStart(app.globalData.user.userId, oppositeUserId).then((json) => {
      if(json.code != 0){
        wx.showModal({
          showCancel: false,
          content: json.message
        })
        return;
      }
      // roomId R5ce039b7e96725678032cdd8
      wx.navigateTo({
        url: '../chatView/chatView?roomId=' + json.data.roomId + '&streamId=' + json.data.streamid + '&toUserId=' + oppositeUserId
      });
      // _t.setData({
      //   ...json.data
      // })

      console.log(_t.data.roomId)
    })
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
        userList: userChatDTOList
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
