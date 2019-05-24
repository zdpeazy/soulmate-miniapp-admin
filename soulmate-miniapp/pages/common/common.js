//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: '',
    muted: false  // 是否静音
  },
  onLoad: function (options) {
    app.globalData.isTalking = true;
    app.editTabBar();
    this.setData({
      toUserId: options.toUserId,
      fromUserId: options.fromUserId,
      time: options.time,
      icon: options.icon,
      nickName: options.nickName,
      chatMatchCount: app.globalData.me.chatMatchCount,
      chatId: options.chatId,
    });
  },
  sendComment(e){
    let evaluate = e.currentTarget.dataset.evaluate;
    let isToUser = this.data.toUserId == app.globalData.user.userId;

    let data = {
      chatId: this.data.chatId,
      fromUserId: this.data.fromUserId,
      toUserId: this.data.toUserId,
    };

    if(isToUser){
      data.toEvaluate = evaluate;
    }else{
      data.fromEvaluate = evaluate;
    }
    
    app.actions.sendComment(data).then(res => {
      if(res.code == 0){
        wx.showToast({
          title: '评价成功'
        })
      }
      wx.redirectTo({
        url: '../index/index'
      });
    })
  },
  back(){
    wx.redirectTo({
      url: '../index/index'
    })
  }
})
