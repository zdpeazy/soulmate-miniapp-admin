//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    type: '',
    fromUserId: '',
    toUserId: ''
  },
  onLoad: function (options) {
    this.setData({
      type: options.type,
      fromUserId: options.fromUserId,
      toUserId: options.toUserId
    })
    app.editTabBar();
    setTimeout(() => {
      wx.redirectTo({
        url: '../talking/talking',
      })
    }, 1000)
  },
  click(){
    if(this.type == 'wait'){  //男的等待

    }else{  // 女的确认
      app.actions.fConfirm({fromUserId: this.data.fromUserId, me: app.globalData.user.userId, agree: 'Y'}).then(res => {
        console.log(res)
        let toUserId = res.data.fromUserId == this.globalData.user.userId ? res.data.toUserId : res.data.fromUserId;
        wx.navigateTo({
          url: '../chatView/chatView?roomID=' + res.data.roomId + '&streamId=' + res.data.streamid + '&toUserId=' + toUserId,
        });
        app.globalData.isTalking = true;
      });
    }
  }
})
